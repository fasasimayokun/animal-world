import { useQuery } from "@tanstack/react-query";
import AnimalPostCard from "../../components/common/AnimalPostCard";
import { useAuthUser } from "../../hooks/useAuthUser";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


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
      {/* Top Bar */}
        <div className='flex items-center gap-4 px-4 py-3 border-b border-gray-700'>
          <Link to={`/profile/${authUser?.username}`}>
            <FaArrowLeft className='w-5 h-5 text-primary' />
          </Link>
          <div>
            <p className='font-bold text-lg'>{authUser?.fullname}</p>
            <p className='text-sm text-gray-500'>@{authUser?.username}</p>
          </div>
        </div>
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
