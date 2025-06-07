import express from "express";
import { getMe, getSavedPost, getUserProfile, login, logout, saveUnsavePost, signup, updateUser } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
 
const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile/:username", protectRoute, getUserProfile);
router.post("/update", protectRoute, updateUser);
router.post("/save/:animalId", protectRoute, saveUnsavePost);
router.get("/:id/saved", protectRoute, getSavedPost);

export default router;