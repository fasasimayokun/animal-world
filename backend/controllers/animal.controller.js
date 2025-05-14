import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Animal from "../models/animal.model.js";

export const createAnimalPost = async (req, res) => {
    try {
        // if(!req.user.isAdmin){
        //     return res.status(403).json({ error: "Only admins can create animal posts."});
        // };

        const { name, description, habitat, facts } = req.body;
        let { image } = req.body;

        const user = await User.findById(req.user._id);
 
        if(!user) return res.status(400).json({ error: "User not found"});

        if(image) {
            const uploadedResponse = await cloudinary.uploader.upload(image);
            image = uploadedResponse.secure_url;
        }

        const newAnimal = new Animal({
            name,
            image,
            description,
            habitat,
            facts
        });

        await newAnimal.save();
        res.status(201).json(newAnimal);
    } catch (error) { 
        console.log("Error in the createAnimalPost controller", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
};

export const deleteAniamlPost = async (req, res) => {
    try {
        const animalPost = await Animal.findById(req.params.id);
        if(!animalPost){
            return res.status(404).json({ error: "Post not found"});
        }
        
        if(animalPost.image) {
            const imgId = animalPost.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Animal.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Post deleted successfully"});
    } catch (error) {
        console.log("Error in deleteAnimalPost controller", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
};

export const getAllAnimalPost = async (req, res) => {
    try {
        const animals = await Animal.find().sort({ createdAt: -1}).populate({
        path: "comments.author",
        select: "username email", // populate comment authors
      })
      .populate({
        path: "comments.replies.author",
        select: "username email", // populate reply authors
      });
      

      if (animals.length === 0){
        return res.status(200).json([]);
      }

      res.status(200).json(animals);
    } catch (error) {
        console.log("Error in the getAllAnimalPost controller", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
};

export const getSingleAnimalPost = async (req, res) => {
    try {
        const animalId = req.params.id;
        const animal = await Animal.findById(animalId).populate({
            path: "comments.author",
            select: "username email profileImg"
        }).populate({
            path: "comments.replies.author",
            select: "username email profileImg"
        });

        if(!animal) {
            return res.status(404).json({ error: "Animal not found"});
        }

        res.status(200).json(animal);
    } catch (error) {
        console.log("Error in getSingleAnimalPost", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
};

export const updateAnimalPost = async (req, res) => {
    try {
        const { name, description, habitat, facts} = req.body;
        let { image } =  req.body;

        let animal = await Animal.findById(req.params.id);

        if(!animal) {
            return res.status(404).json({ error: "Animal not found"});
        }

        if(image) {
            if (animal.image) {
                await cloudinary.uploader.destroy(animal.image.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(image);
            image = uploadedResponse.secure_url;
        }

        animal.name = name || animal.name;
        animal.image = image || animal.image;
        animal.description = description || animal.description;
        animal.habitat =  habitat || animal.habitat;
        animal.facts = facts || animal.facts;

        animal = await animal.save();

        res.status(200).json(animal);
    } catch (error) {
        console.log("Error in the updateAnimalPost", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
};