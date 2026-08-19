import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", (req, res, next) => {
  console.log("REGISTER ROUTE REACHED");
  next();
}, registerUser);

router.post("/login", loginUser);

router.get("/me", protect, getCurrentUser);

export default router;