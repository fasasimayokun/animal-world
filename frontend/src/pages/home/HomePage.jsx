import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import AnimalPostCard from "../../components/common/AnimalPostCard";

const HomePage = () => {
  const { data: animals = [], isLoading, isError, error } = useQuery({
    queryKey: ['animals'],
    queryFn: async () => {
      const res = await fetch("/api/animals/all");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  // 🔍 Search and Pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔍 Filter animals by name
  const filteredAnimals = animals.filter((animal) =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📊 Pagination logic
  const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAnimals = filteredAnimals.slice(indexOfFirst, indexOfLast);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="max-w-5xl mx-auto ml-0 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Animal Kingdom</h1>

      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search animals..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset to first page on new search
        }}
        className="w-full max-w-md mx-auto block mb-6 p-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-500">{error.message}</p>}

      {/* 🐾 Animal Cards */}
      <div className="space-y-6">
        {currentAnimals.length === 0 ? (
          <p className="text-center text-gray-500">No animals found.</p>
        ) : (
          currentAnimals.map(animal => (
            <AnimalPostCard key={animal._id} animal={animal} />
          ))
        )}
      </div>

      {/* 📍 Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md transition-colors disabled:opacity-50 bg-neutral text-neutral-content hover:bg-neutral-focus"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded-md transition-colors ${
                currentPage === idx + 1
                  ? "bg-primary text-primary-content font-semibold"
                  : "bg-base-200 text-base-content hover:bg-base-300"
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md transition-colors disabled:opacity-50 bg-neutral text-neutral-content hover:bg-neutral-focus"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
