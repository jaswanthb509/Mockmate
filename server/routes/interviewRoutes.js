import express from "express";

import {
  saveInterview,
  evaluateInterview,
  getUserInterviews,
  getInterviewById,
} from "../controllers/interviewController.js";

import generateAIQuestions from "../controllers/aiController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/generate-questions",
  authMiddleware,
  generateAIQuestions
);

router.post(
  "/save",
  authMiddleware,
  saveInterview
);

router.post(
  "/evaluate",
  authMiddleware,
  evaluateInterview
);

router.get(
  "/history",
  authMiddleware,
  getUserInterviews
);

router.get(
  "/:id",
  authMiddleware,
  getInterviewById
);

export default router;