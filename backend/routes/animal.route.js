import express from "express";
import { createAnimalPost, deleteAniamlPost } from "../controllers/animal.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create", protectRoute, createAnimalPost);
router.delete("/:id", protectRoute, deleteAniamlPost);

export default router;