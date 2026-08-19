import express from "express";
import { generateInterview } from "../controllers/InterviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateInterview);

export default router;