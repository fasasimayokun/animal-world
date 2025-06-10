import { useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const AnimalPostPage = () => {
  const [animal, setAnimal] = useState({
    name: "",
    imageBase64: null,
    imagePreview: null,
    description: "",
    facts: "",
    habitat: []
  });
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: create, isLoading, isError, error } = useMutation({
    mutationFn: async ({ name, imageBase64, description, facts, habitat }) => {
      const res = await fetch("/api/animals/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          image: imageBase64, // key must be 'image' for backend
          description,
          facts,
          habitat,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Animal created successfully");
      queryClient.invalidateQueries(["animals"]);
      setAnimal({
        name: "",
        imageBase64: null,
        imagePreview: null,
        description: "",
        facts: "",
        habitat: [],
      });
      navigate("/animals");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    create(animal);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnimal((prev) => ({
          ...prev,
          imageBase64: reader.result,
          imagePreview: URL.createObjectURL(file),
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl ml-0 mx-auto rounded-lg shadow-md p-8 space-y-8">
      <h2 className="text-3xl font-bold text-center mb-6">Post Animal</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="input input-bordered w-full"
          value={animal.name}
          onChange={(e) => setAnimal({ ...animal, name: e.target.value })}
          required
        />

        <div>
          <label className="block font-medium mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
          />
          {animal.imagePreview && (
            <img
              src={animal.imagePreview}
              alt="Preview"
              className="mt-4 rounded-md max-h-64 object-contain"
            />
          )}
        </div>

        <textarea
          name="description"
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          rows={4}
          value={animal.description}
          onChange={(e) => setAnimal({ ...animal, description: e.target.value })}
          required
        />

        <div>
          <label className="block font-medium mb-1">Interesting Facts (one per line)</label>
          <textarea
            name="facts"
            placeholder="Enter each fact on a new line"
            className="textarea textarea-bordered w-full"
            rows={5}
            value={animal.facts}
            onChange={(e) => setAnimal({ ...animal, facts: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Habitat</label>
          <div className="flex flex-wrap gap-6">
            {["land", "water", "air"].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={type}
                  checked={animal.habitat.includes(type)}
                  onChange={(e) => {
                    const newHabitat = e.target.checked
                      ? [...animal.habitat, type]
                      : animal.habitat.filter(h => h !== type);
                    setAnimal({ ...animal, habitat: newHabitat });
                  }}
                  className="checkbox checkbox-primary"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Animal"}
        </button>

        {isError && <p className="text-red-500 mt-2">{error.message}</p>}
      </form>
    </div>
  );
};

export default AnimalPostPage;
