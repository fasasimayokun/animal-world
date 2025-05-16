import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createAnimalPost, deleteAniamlPost, getAllAnimalPost,
    getSingleAnimalPost, thumbsUpAndDownOnAniaml, updateAnimalPost } from "../controllers/animal.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllAnimalPost);
router.get("/:id", protectRoute, getSingleAnimalPost);
router.post("/create", protectRoute, createAnimalPost);
router.post("/update/:id", protectRoute, updateAnimalPost);
router.delete("/:id", protectRoute, deleteAniamlPost);
router.post('/vote/:animalId/:voteType', protectRoute, thumbsUpAndDownOnAniaml);


export default router;