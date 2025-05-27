import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const EditAnimalPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [animal, setAnimal] = useState({
    name: "",
    imageFile: null,      // Base64 string
    imagePreview: null,   // For displaying preview
    description: "",
    facts: "",
    habitat: [],
  });

  // Fetch current animal data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["animal", id],
    queryFn: async () => {
      const res = await fetch(`/api/animals/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load animal");
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setAnimal({
        name: data.name || "",
        imageFile: null,
        imagePreview: data.image || null, // assuming backend returns full Cloudinary URL
        description: data.description || "",
        facts: Array.isArray(data.facts) ? data.facts.join("\n") : data.facts || "",
        habitat: data.habitat || [],
      });
    }
  }, [data]);

  // 🧠 Convert image to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnimal((prev) => ({
          ...prev,
          imageFile: reader.result, // base64 string
          imagePreview: URL.createObjectURL(file), // show preview
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Mutation to update the animal
  const { mutate: updateAnimal, isPending } = useMutation({
    mutationFn: async ({ name, imageFile, description, facts, habitat }) => {
      const res = await fetch(`/api/animals/update/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          image: imageFile, // base64 string or null
          description,
          facts,
          habitat,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
    },
    onSuccess: () => {
      toast.success("Animal updated successfully");
      queryClient.invalidateQueries(["animals"]);
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAnimal(animal);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-red-500">Error loading animal</p>;

  return (
    <div className="max-w-4xl mx-auto p-0 bg-white rounded-lg shadow-md space-y-8">
      <h2 className="text-3xl font-bold text-center mb-6">Edit Animal</h2>
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
          <label className="font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
          />
          {animal.imagePreview ? (
            <img
              src={animal.imagePreview}
              alt="Preview"
              className="mt-4 rounded-md max-h-64 object-contain"
            />
          ) : (
            <p className="text-gray-400 italic mt-4">No image uploaded yet</p>
          )}
        </div>

        <textarea
          name="description"
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          rows={4}
          value={animal.description}
          onChange={(e) =>
            setAnimal({ ...animal, description: e.target.value })
          }
          required
        />

        <div>
          <label className="font-medium">
            Interesting Facts (one per line)
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

        <div>
          <label className="font-medium">Habitat</label>
          <div className="flex flex-wrap gap-4">
            {["land", "water", "air"].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={type}
                  checked={animal.habitat.includes(type)}
                  onChange={(e) => {
                    const newHabitat = e.target.checked
                      ? [...animal.habitat, type]
                      : animal.habitat.filter((h) => h !== type);
                    setAnimal({ ...animal, habitat: newHabitat });
                  }}
                  className="checkbox checkbox-primary"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          {isPending ? "Updating..." : "Update Animal"}
        </button>
      </form>
    </div>
  );
};

export default EditAnimalPostPage;
