import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import { getRecommendations } from "../controllers/recommender.js"; // New import
const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

/* RECOMMENDATIONS */
router.get("/recommendations/:userId", verifyToken, getRecommendations); // New route

export default router;
