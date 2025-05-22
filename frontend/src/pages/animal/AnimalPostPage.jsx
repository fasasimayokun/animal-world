import { useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const AnimalPostPage = () => {
  const [animal, setAnimal] = useState({
    name: "",
    imageFile: null,      // store the selected File object
    imagePreview: null,   // store the local preview URL
    description: "",
    facts: "",  // single string with multiple lines
    habitat: []
  });

  const queryClient = useQueryClient();
  const { mutate: create, isPending, isError, error } = useMutation({
    mutationFn: async ({ name, imageFile, description, facts, habitat }) => {
      try {
        // Prepare form data for image upload
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("facts", facts);
        habitat.forEach(h => formData.append("habitat", h));
        if (imageFile) {
          formData.append("image", imageFile);
        }

        const res = await fetch("/api/animals/create", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Animal created successfully");
      queryClient.invalidateQueries(["animals"]); // refresh animals list if you have one
      // reset form if you want
      setAnimal({
        name: "",
        imageFile: null,
        imagePreview: null,
        description: "",
        facts: "",
        habitat: []
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    create(animal);
  };

  // Handle image file select & preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAnimal((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-8">
      <h2 className="text-3xl font-bold text-center mb-6">Post Animal</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="input input-bordered w-full"
            value={animal.name}
            onChange={(e) => setAnimal({ ...animal, name: e.target.value })}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Upload Image</span>
          </label>
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

        <div className="form-control">
          <textarea
            name="description"
            placeholder="Description"
            className="textarea textarea-bordered w-full"
            rows={4}
            value={animal.description}
            onChange={(e) => setAnimal({ ...animal, description: e.target.value })}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Interesting Facts (one per line)</span>
          </label>
          <textarea
            name="facts"
            placeholder="Enter each fact on a new line"
            className="textarea textarea-bordered w-full"
            rows={5}
            value={animal.facts}
            onChange={(e) => setAnimal({ ...animal, facts: e.target.value })}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Habitat</span>
          </label>
          <div className="flex flex-row gap-4 flex-wrap">
            {["land", "water", "air"].map((type) => (
              <label key={type} className="cursor-pointer label justify-start gap-2">
                <input
                  type="checkbox"
                  name="habitat"
                  value={type}
                  checked={animal.habitat.includes(type)}
                  onChange={(e) => {
                    const newHabitat = e.target.checked
                      ? [...animal.habitat, type]
                      : animal.habitat.filter((item) => item !== type);
                    setAnimal({ ...animal, habitat: newHabitat });
                  }}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          {isPending ? "Loading..." : "Create Animal"}
        </button>

        {isError && <p className="text-red-500 mt-2">{error.message}</p>}
      </form>
    </div>
  );
};

export default AnimalPostPage;
