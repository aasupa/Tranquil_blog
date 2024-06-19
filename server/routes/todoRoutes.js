import express from "express";
import {
  deleteTodo,
  getAllTodo,
  newTodo,
  updateTodo,
} from "../controllers/todoControllers.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, newTodo);
router.get("/", verifyToken, getAllTodo);
router.put("/:id", verifyToken, updateTodo);
router.delete("/:id", verifyToken, deleteTodo);

export default router;
