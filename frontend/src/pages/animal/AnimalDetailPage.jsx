import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommentPage from '../comment/CommentPage';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { IoCalendarOutline } from 'react-icons/io5';
import { formatMemberSinceDate } from '../../utils/date';

const AnimalDetailPage = () => {
  const { id } = useParams();
  
  const { data: animal, isLoading, error } = useQuery({
    queryKey: ['animal', id],
    queryFn: async () => {
      const res = await fetch(`/api/animals/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch animal');
      return data;
    },
  });
  
  const postedOnDate = formatMemberSinceDate(animal?.createdAt);

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-error">{error.message}</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4 bg-base-100 text-base-content rounded-lg shadow">
      {/* Top Bar */}
        <div className='flex items-center gap-4 px-4 py-3 border-b border-gray-700'>
          <Link to='/animals'>
            <FaArrowLeft className='w-5 h-5 text-primary' />
          </Link>
          <div>
            <p className='font-bold text-lg'>back</p>
          </div>
        </div>
      <img
        src={animal.image}
        alt={animal.name}
        className="w-full h-64 object-cover rounded-xl shadow-md"
      />
      <h1 className="text-2xl font-bold">{animal.name}</h1>
      <p className="text-base-content">{animal.description}</p>

      {/* Facts */}
      <div>
        <h2 className="font-semibold mb-1">Facts:</h2>
        <ul className="list-disc list-inside text-base-content">
          {animal.facts.split('\n').map((fact, idx) => (
            <li key={idx}>{fact}</li>
          ))}
        </ul>
      </div>

      <p className="text-base-content">
        <strong>Habitat:</strong> {animal.habitat.join(', ')}
      </p>

      <div className='flex items-center gap-2 text-gray-400 text-sm'>
        <IoCalendarOutline className='w-4 h-4' />
        <span>Posted on {postedOnDate}</span>
      </div>

    </div>
  );
};

export default AnimalDetailPage;
