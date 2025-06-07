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
        await animal.save();
        
        res.status(200).json(animal);        
    } catch (error) {
        console.log("Error in commentOnAnimalPost", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
};

export const getAnimalComments = async (req, res) => {
  try {
    const { id } = req.params;

    const animal = await Animal.findById(id)
      .populate("comments.author", "username profileImg")
      .populate("comments.replies.author", "username profileImg");

    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }

    res.status(200).json(animal.comments);
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateComment = async (req, res) => {
    try {
        const {animalId, commentId} = req.params;
        const authorId = req.user._id;
        const { text } = req.body;

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
        animal.comments.pull(commentId); 

        // Save the updated animal
        await animal.save();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.log("Error in deleteComment controller", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
};

export const thumbsUpAndDownOnComment = async (req, res) => {
    try {
        const { animalId, commentId, voteType } = req.params;
        const userId = req.user._id;

        const animal = await Animal.findById(animalId);
        if (!animal) return res.status(404).json({ error: "Animal not found" });

        const comment = animal.comments.id(commentId);
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        const isThumbsUp = comment.thumbsUp.includes(userId);
        const isThumbsDown = comment.thumbsDown.includes(userId);

        if (voteType === "up") {
            if (isThumbsUp) {
                comment.thumbsUp.pull(userId);
            } else {
                comment.thumbsUp.push(userId);
                if (isThumbsDown) {
                    comment.thumbsDown.pull(userId);
                }
            }
        } else if (voteType === "down") {
            if (isThumbsDown) {
                comment.thumbsDown.pull(userId)
            } else {
                comment.thumbsDown.push(userId);
                if (isThumbsUp) {
                    comment.thumbsUp.pull(userId);
                }
            }
        } else {
        return res.status(400).json({ error: "Invalid vote type" });
        }

        await animal.save();

        res.status(200).json({
            message: `Vote on comment ${voteType} updated`,
            thumbsUp: comment.thumbsUp.length,
            thumbsDown: comment.thumbsDown.length,
        });
    } catch (error) {
        console.log("Error thumbsUpAndDownOnComment controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const replyOnAnimalComment = async (req, res) => {
    try {
        const { animalId, commentId} = req.params;
        const authorId = req.user._id;
        const { text } = req.body;

        const animal = await Animal.findById(animalId);
        if(!animal) {
            return res.status(404).json({ error: "Animal not found"});
        }

        const comment = animal.comments.id(commentId);
        if(!comment) {
            return res.status(404).json({ error: "No comment available"});
        }

        const reply = {
            author: authorId,
            text
        }

        comment.replies.push(reply);

        await animal.save();

        res.status(201).json(animal);
    } catch (error) {
        console.log("Error in replyOnAnimalComment controller", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
};

export const updateReply = async (req, res) => {
    try {
        const { animalId, commentId, replyId} = req.params;
        const authorId = req.user._id;
        const { text } = req.body;

        const animal = await Animal.findById(animalId);
        if(!animal) {
            return res.status(404).json({ error: "Animal not found"});
        }

        const comment = animal.comments.id(commentId);
        if(!comment) {
            return res.status(404).json({ error: "No comment available"});
        }

        const reply = comment.replies.id(replyId);
        if(!reply) {
            return res.status(404).json({ error: "No reply available"});
        }

        if (!reply.author.equals(authorId)) {
      return res.status(403).json({ error: "Unauthorized to update this reply" });
    }

    reply.text = text || reply.text;
    await animal.save();

    res.status(200).json(animal);
    } catch (error) {
        console.log("Error in updateReply controller",  error.message);
        res.status(500).json({ error: "Internal server error"});
    }
};

export const deleteReply = async (req, res) => {
    try {
        const { animalId, commentId, replyId } = req.params;
        const authorId = req.user._id;

        const animal = await Animal.findById(animalId);
        if (!animal) {
        return res.status(404).json({ error: "Animal not found" });
        }

        const comment = animal.comments.id(commentId);
        if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
        }

        const reply = comment.replies.id(replyId);
        if (!reply) {
        return res.status(404).json({ error: "Reply not found" });
        }

        if (!reply.author.equals(authorId)) {
        return res.status(403).json({ error: "Unauthorized to delete this reply" });
        }

        comment.replies.pull(replyId);
        await animal.save();

        res.status(200).json({ message: "Reply deleted successfully" });
    } catch (error) {
        console.log("Error in deleteReply controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const thumbsUpAndDownOnReply = async (req, res) => {
    try {
        const { animalId, commentId, replyId, voteType } = req.params;
        const userId = req.user._id;

        const animal = await Animal.findById(animalId);
        if (!animal) return res.status(404).json({ error: "Animal not found" });

        const comment = animal.comments.id(commentId);
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        const reply = comment.replies.id(replyId);
        if (!reply) return res.status(404).json({ error: "Reply not found" });

        const isThumbsUp = reply.thumbsUp.includes(userId);
        const isThumbsDown = reply.thumbsDown.includes(userId);

        if (voteType === "up") {
            if (isThumbsUp) {
                reply.thumbsUp.pull(userId);
            } else {
                reply.thumbsUp.push(userId);
                if (isThumbsDown) {
                    reply.thumbsDown.pull(userId);
                }
            }
        } else if (voteType === "down") {
            if (isThumbsDown) {
                reply.thumbsDown.pull(userId);
            } else {
                reply.thumbsDown.push(userId);
                if (isThumbsUp) {
                    reply.thumbsUp.pull(userId);
                }
            }
        } else {
            return res.status(400).json({ error: "Invalid vote type" });
        }

        await animal.save();

        res.status(200).json({
            message: `Vote on reply ${voteType} updated`,
            thumbsUp: reply.thumbsUp.length,
            thumbsDown: reply.thumbsDown.length,
        });
    } catch (error) {
        console.log("Error thumbsUpAndDownOnReply controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
