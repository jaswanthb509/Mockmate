import Interview from "../models/Interview.js";
import { generateInterviewQuestions } from "../services/geminiService.js";

export const generateInterview = async (req, res) => {
  try {
    const questions = await generateInterviewQuestions(req.body);

    const interview = await Interview.create({
      user: req.user.id,
      role: req.body.role,
      experience: req.body.experience,
      difficulty: req.body.difficulty,
      interviewType: req.body.interviewType,
      techStack: req.body.techStack,
      numberOfQuestions: req.body.numberOfQuestions,
      questions,
    });

    res.status(201).json(interview);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Interview generation failed.",
    });
  }
};