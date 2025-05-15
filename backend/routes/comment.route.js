import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { commentOnAnimalPost, deleteComment, updateComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/:id", protectRoute, commentOnAnimalPost);
router.post("update/:animalId/:commentId", protectRoute, updateComment);
router.delete("/:animalId/:commentId", protectRoute, deleteComment);

export default router;