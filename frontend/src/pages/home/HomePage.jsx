import { useState } from "react";
import { Bookmark, Edit, Menu, MessageSquare, Trash, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const { data: animals = [] } = useQuery({
    queryKey: ['animals'],
    queryFn: async () => {
      const res = await fetch("/api/animals/all"); // ✅ Fixed typo
      const data = await res.json();               // ✅ Added await
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    }
  });

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <div
        className={`bg-gray-100 w-64 p-4 fixed z-40 top-0 left-0 h-full shadow-lg transform transition-transform duration-300 ease-in-out 
        ${showSidebar ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:block`}
      >
        <h2 className="text-xl font-bold mb-4">Sidebar</h2>
        <ul className="space-y-2">
          <li>Dashboard</li>
          <li>Explore</li>
          <li>Saved</li>
          <Link to='animal/post'>
            <li>create post</li>
          </Link>
        </ul>
      </div>

      {/* Overlay when sidebar is open */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 p-4 relative z-10 flex flex-col">
        {/* Top bar for small screens */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <button onClick={toggleSidebar}>
            {showSidebar ? <X size={24} /> : <Menu size={24} />}
          </button>
           {/* ❌ FIX: Replace this with something meaningful or just remove */}
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-8 w-full">
          Animal Kingdom
        </h1>

        {/* Animal Cards 
        {isLoading && <p className="text-center text-gray-500">Loading animals...</p>}
        {isError && <p className="text-center text-red-500">{error.message}</p>} */}

        <div className="space-y-6">
          {animals.map((animal) => (
            <div
              key={animal._id}
              className="bg-gray-50 p-4 rounded-md shadow-md max-w-4xl w-full mx-auto"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <img
                  src={animal.image || "https://placehold.co/200"}
                  alt={animal.name || "Animal"}
                  className="w-full md:w-48 h-48 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold">{animal.name}</h3>
                  <p className="text-gray-600">{animal.description}</p>

                  {/* Optional: display facts as bullet points 
                  {animal.facts && (
                    <ul className="list-disc list-inside mt-2 text-gray-700 text-sm">
                      {animal.facts.split("\n").map((fact, i) => (
                        <li key={i}>{fact}</li>
                      ))}
                    </ul>
                  )} */}
                </div>
              </div>

              {/* Footer icons */}
              <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-gray-500 border-t pt-3 text-lg gap-3">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1">
                    <MessageSquare className="size-5" />
                    {animal.comments.length|| 3}
                  </button>
                  <button aria-label="Save post">
                    <Bookmark className="size-5" />
                  </button>
                </div>
                <div className="hidden md:flex gap-4">
                  <button aria-label="Edit post">
                    <Edit className="size-5" />
                  </button>
                  <button aria-label="Delete post">
                    <Trash className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
