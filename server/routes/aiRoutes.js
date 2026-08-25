import express from "express";

import {
  generateAIQuestions,
  evaluateAIAnswers,
} from "../controllers/aiController.js";

const router = express.Router();

router.post(
  "/generate-questions",
  generateAIQuestions
);

router.post(
  "/evaluate",
  evaluateAIAnswers
);

export default router;