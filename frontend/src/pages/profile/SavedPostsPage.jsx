import { useQuery } from "@tanstack/react-query";
import AnimalPostCard from "../../components/common/AnimalPostCard";
import { useAuthUser } from "../../hooks/useAuthUser";


const SavedPostsPage = () => {
  const { data: authUser } = useAuthUser();
  const { data: savedPosts, isLoading } = useQuery({
    queryKey: ["savedPosts", authUser._id],
    queryFn: async () => {
      const res = await fetch(`/api/auth/${authUser._id}/saved`);
      if (!res.ok) throw new Error("Failed to fetch saved posts");
      return res.json();
    },
    enabled: !!authUser?._id, // ensures query only runs when user is loaded
  });

  if (isLoading) return <p>Loading saved posts...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Saved Posts</h1>
      <div className="grid gap-4">
        {savedPosts?.length ? (
          savedPosts.map((post) => <AnimalPostCard key={post._id} animal={post} />)
        ) : (
          <p>You haven't saved any animal posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default SavedPostsPage;
