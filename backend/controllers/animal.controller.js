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