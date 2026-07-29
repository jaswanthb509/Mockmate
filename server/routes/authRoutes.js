import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private Routes
router.get("/me", protect, getCurrentUser);

export default router;