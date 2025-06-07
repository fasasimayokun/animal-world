import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CommentPage from '../comment/CommentPage';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';


const AnimalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: animal, isLoading, error } = useQuery({
    queryKey: ['animal', id],
    queryFn: async () => {
      const res = await fetch(`/api/animals/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch animal');
      return data;
    },
  });

  const [showComments, setShowComments] = useState(false);

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error.message}</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <img
        src={animal.image}
        alt={animal.name}
        className="w-full h-64 object-cover rounded-xl shadow-md"
      />
      <h1 className="text-2xl font-bold">{animal.name}</h1>
      <p className="text-gray-700">{animal.description}</p>

      {/* Facts line by line */}
      <div>
        <h2 className="font-semibold mb-1">Facts:</h2>
        <ul className="list-disc list-inside text-gray-700">
          {animal.facts.split('\n').map((fact, idx) => (
            <li key={idx}>{fact}</li>
          ))}
        </ul>
      </div>

      <p className="text-gray-700"><strong>Habitat:</strong> {animal.habitat}</p>

      {/* Comments summary & thumbs up/down counts */}
      

      {/* Modal or inline comment page */}
      
    </div>
  );
};

export default AnimalDetailPage;