import express from "express";
import { getRecommendations } from "../controllers/recommender.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* GET RECOMMENDATIONS */
router.get("/:userId", verifyToken, getRecommendations);

export default router;