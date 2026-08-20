import express from "express";

import {
  saveInterview,
  getUserInterviews,
  getInterviewById,
} from "../controllers/interviewController.js";

import generateAIQuestions from "../controllers/aiController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate AI interview questions
router.post(
  "/generate-questions",
  authMiddleware,
  generateAIQuestions
);

// Save completed interview
router.post(
  "/save",
  authMiddleware,
  saveInterview
);

// Get interview history
router.get(
  "/history",
  authMiddleware,
  getUserInterviews
);

// Get a specific interview
router.get(
  "/:id",
  authMiddleware,
  getInterviewById
);

export default router;