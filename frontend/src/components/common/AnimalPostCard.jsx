import { Bookmark, Edit, MessageSquare, Trash, ThumbsUp, ThumbsDown, BookmarkCheck, } from "lucide-react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuthUser } from "../../hooks/useAuthUser";

const AnimalPostCard = ({ animal }) => {
  const queryClient = useQueryClient();
  const { data: authUser } = useAuthUser();
  const currentUserId = authUser?._id;

  const hasVotedUp = animal.thumbsUp?.includes(currentUserId);
  const hasVotedDown = animal.thumbsDown?.includes(currentUserId);

  const hasBookmarked = authUser?.saved?.includes(animal._id);

  const { mutate: thumbs } = useMutation({
  mutationFn: async (val) => {
    const res = await fetch(`api/animals/vote/${animal._id}/${val}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Couldn't vote on animal");
    }
    return data;
  },

  // ✅ Optimistic update
  onMutate: async (val) => {
    await queryClient.cancelQueries({ queryKey: ['animals'] });

    const previousAnimals = queryClient.getQueryData(['animals']);

    queryClient.setQueryData(['animals'], (old) => {
      if (!old) return old;

      return old.map((a) => {
        if (a._id !== animal._id) return a;

        const hasUp = a.thumbsUp.includes(currentUserId);
        const hasDown = a.thumbsDown.includes(currentUserId);

        let newThumbsUp = [...a.thumbsUp];
        let newThumbsDown = [...a.thumbsDown];

        if (val === "up") {
          // Remove down if already downvoted
          if (hasDown) newThumbsDown = newThumbsDown.filter((id) => id !== currentUserId);

          if (hasUp) {
            newThumbsUp = newThumbsUp.filter((id) => id !== currentUserId);
          } else {
            newThumbsUp.push(currentUserId);
          }
        } else if (val === "down") {
          // Remove up if already upvoted
          if (hasUp) newThumbsUp = newThumbsUp.filter((id) => id !== currentUserId);

          if (hasDown) {
            newThumbsDown = newThumbsDown.filter((id) => id !== currentUserId);
          } else {
            newThumbsDown.push(currentUserId);
          }
        }

        return {
          ...a,
          thumbsUp: newThumbsUp,
          thumbsDown: newThumbsDown,
        };
      });
    });

    return { previousAnimals };
  },

  onError: (err, val, context) => {
    queryClient.setQueryData(['animals'], context.previousAnimals);
    toast.error(err.message || "Vote failed");
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['animals'] });
  },
});


    const handleThumbsUpAndDown = (val) => {
      thumbs(val);
    };

    const { mutate: bookmark } = useMutation({
    mutationFn: async (animalId) => {
      const res = await fetch(`api/auth/save/${animalId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "couldn't save animal post");
      }
      return data;
    },
    // 👇 Optimistic UI update
    onMutate: async (animalId) => {
      await queryClient.cancelQueries({ queryKey: ['authUser'] });

      const previousUser = queryClient.getQueryData(['authUser']);

      // Optimistically update saved array
      queryClient.setQueryData(['authUser'], (old) => {
        if (!old) return old;

        const isSaved = old.saved.includes(animalId);
        return {
          ...old,
          saved: isSaved
            ? old.saved.filter((id) => id !== animalId)
            : [...old.saved, animalId]
        };
      });

      return { previousUser };
    },
    onError: (err, animalId, context) => {
      // Rollback if there's an error
      queryClient.setQueryData(['authUser'], context.previousUser);
      toast.error(err.message || "Error saving animal");
    },
    onSettled: () => {
      // Ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    }
  });

  const handleBookmark = (animalId) => {
    bookmark(animalId);
  }

  const { mutate: deleteAnimalPost, isPending } = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/animals/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete post");
      return data;
    },
    onSuccess: () => {
      toast.success("Animal post deleted");
      queryClient.invalidateQueries({queryKey: ["animals"]}); // Refresh animal list
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete");
    },
  });

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this animal?");
    if(confirmDelete){
      deleteAnimalPost(id);
    }
  };


  return (
    <div className="bg-gray-50 p-4 rounded-md shadow-md max-w-4xl w-full mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        <img
          src={animal.image || "https://placehold.co/200"}
          alt={animal.name || "Animal"}
          className="w-full md:w-48 h-48 object-cover rounded-md"
        />
        <div className="flex-1">
          <h3 className="text-2xl font-semibold">{animal.name}</h3>
          <p className="text-gray-600">{animal.description}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 text-gray-500 border-t pt-3 text-lg">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1">
            <MessageSquare className="size-5" />
            {animal?.comments?.length ?? 0}
          </button>
          <button
            onClick={() => handleThumbsUpAndDown("up")}
            className={`flex items-center gap-1 transition-colors ${
              hasVotedUp ? "text-green-600 font-bold" : "text-gray-500"
            }`}
          >
            <ThumbsUp className="size-5" />
            {animal.thumbsUp?.length ?? 0}
          </button>

          <button
            onClick={() => handleThumbsUpAndDown("down")}
            className={`flex items-center gap-1 transition-colors ${
              hasVotedDown ? "text-red-600 font-bold" : "text-gray-500"
            }`}
          >
            <ThumbsDown className="size-5" />
            {animal.thumbsDown?.length ?? 0}
          </button>
          <button aria-label="Save post" onClick={() => handleBookmark(animal._id)}>
            {hasBookmarked ? (
              <BookmarkCheck className="size-5 text-blue-500 fill-blue-500" />
            ) : (
              <Bookmark className="size-5 text-gray-500" />
            )}
          </button>
        </div>
        <div className="hidden md:flex gap-4">
          <Link to={`/animal/update/${animal._id}`}>
            <Edit className="size-5" />
          </Link>
          <button aria-label="Delete post"
            onClick={() => handleDelete(animal._id)}
            disabled={isPending}
            className="text-red-500
            hover:text-red-700"
          >
            <Trash className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimalPostCard;