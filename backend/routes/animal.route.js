import express from "express";
import { createAnimalPost, deleteAniamlPost, getAllAnimalPost } from "../controllers/animal.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/all", protectRoute, getAllAnimalPost);
router.post("/create", protectRoute, createAnimalPost);
router.delete("/:id", protectRoute, deleteAniamlPost);

export default router;