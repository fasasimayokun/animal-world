import Animal from "../models/animal.model.js";
import User from "../models/user.model.js";

export const commentOnAnimalPost = async (req, res) => {
    try {
          const { text } = req.body;
          const animalPostId = req.params.id;
          const authorId = req.user._id;

          if(!text) {
            return res.status(400).json({ error: "Text field is required"});
          }

          const animal = await Animal.findById(animalPostId);
          if(!animal) {
            return res.status(400).json({ error: "Aniaml not found"});
          }
          const comment = {
            author: authorId,
            text
          };

          animal.comments.push(comment);
          await animal.save()

    } catch (error) {
        console.log("Error in commentOnAnimalPost", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
};

export const updateComment = async (req, res) => {
    try {
        const {animalId, commentId} = req.params;
        const authorId = req.user._id;

        const animal = await Animal.findById(animalId);
        const comment = animal.comments.id(commentId);

        if (!animal) {
            return res.status(400).json({ error: "Animal not found"});
        }

        if(!comment) {
            return res.status(400).json({ error: "comment not found"});
        }

        if(!comment.author.equals(authorId)) {
            return res.status(400).json({ error : "You are not authorized to update"});
        }
        
        comment.text = text || comment.text;

        await animal.save();

        res.status(200).json({ message: "comment edited successfully"});
    } catch (error) {
        console.log("Error in updatecomment controller", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { animalId, commentId} = req.params;
        const authorId = req.user._id;

        const animal = await Animal.findById(animalId);
        if (!animal) {
            return res.status(404).json({ error: "Animal not found"});
        }

        const comment = animal.comments.id(commentId);
        if(!comment) {
            return res.status(404).json({ error: "Comment not found"});
        }

        // Only allow deletion if the user is the comment's author
    if (!comment.author.equals(authorId)) {
      return res.status(403).json({ error: "Unauthorized to delete this comment" });
    }

    // Remove the comment
    comment.remove(); // or animal.comments.id(commentId).remove()

    // Save the updated animal
    await animal.save();

    res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.log("Error in deleteComment controller", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
};