import express from "express";

import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/me", protect, getCurrentUser);

export default router;