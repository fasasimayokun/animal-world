import { MessageSquare, Bookmark, Edit, Trash2 } from "lucide-react";

const AnimalCardPage = ({ animal, isAdmin }) => {
  return (
    <div className="card bg-base-100 shadow-md rounded-lg overflow-hidden">
      {/* Animal Image */}
      <figure>
        <img src={animal.image} alt={animal.name} className="w-full h-48 object-cover" />
      </figure>

      {/* Card Body */}
      <div className="card-body p-4">
        <h2 className="card-title capitalize">{animal.name}</h2>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between mt-2 text-sm text-base-content/80">
          {/* Comment Icon and Count */}
          <div className="flex items-center gap-1">
            <MessageSquare className="size-4" />
            <span>{animal.comments?.length || 0}</span>
          </div>

          {/* Saved Icon */}
          <Bookmark className="size-4 cursor-pointer" />

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <Edit className="size-4 cursor-pointer" />
              <Trash2 className="size-4 cursor-pointer text-red-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimalCardPage;