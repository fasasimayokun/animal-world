// HomePage.jsx
import { useQuery } from "@tanstack/react-query";
import AnimalPostCard from "../../components/common/AnimalPostCard";

const HomePage = () => {
  const { data: animals = [], isLoading, isError, error } = useQuery({
    queryKey: ['animals'],
    queryFn: async () => {
      const res = await fetch("/api/animals/all");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    }
  });

  return (
    <div className="max-w-5xl mx-auto ml-0">
      <h1 className="text-3xl font-bold text-center mb-8">Animal Kingdom</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-500">{error.message}</p>}
      <div className="space-y-6">
        {animals.map(animal => (
          <AnimalPostCard key={animal._id} animal={animal} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
