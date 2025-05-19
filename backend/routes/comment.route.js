import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { commentOnAnimalPost, deleteComment, deleteReply,
    replyOnAnimalComment, thumbsUpAndDownOnComment, thumbsUpAndDownOnReply, updateComment, updateReply } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/:id", protectRoute, commentOnAnimalPost);
router.put("/update/:animalId/:commentId", protectRoute, updateComment);
router.delete("/:animalId/:commentId", protectRoute, deleteComment);
router.post('/vote/:animalId/comment/:commentId/:voteType', protectRoute, thumbsUpAndDownOnComment);

router.post("/reply/:animalId/:commentId", protectRoute, replyOnAnimalComment);
router.post("/reply/:animalId/:commentId/:replyId", protectRoute, updateReply);
router.delete("/reply/:animalId/:commentId/:replyId", protectRoute, deleteReply);
router.post('/vote/:animalId/comment/:commentId/reply/:replyId/:voteType', protectRoute, thumbsUpAndDownOnReply);


export default router;