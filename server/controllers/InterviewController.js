import Interview from "../models/Interview.js";
import { evaluateInterviewAnswers } from "../services/aiService.js";

export const saveInterview = async (req, res) => {
  try {
    const {
      role,
      experience,
      difficulty,
      interviewType,
      techStack,
      totalQuestions,
      answeredQuestions,
      completionScore,
      answers,
    } = req.body;

    if (
      !role ||
      !experience ||
      !difficulty ||
      !interviewType ||
      !totalQuestions
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required interview information",
      });
    }

    const interview = await Interview.create({
      user: req.user._id,
      role,
      experience,
      difficulty,
      interviewType,
      techStack: techStack || "",
      totalQuestions,
      answeredQuestions: answeredQuestions || 0,
      completionScore: completionScore || 0,
      answers: answers || [],
    });

    return res.status(201).json({
      success: true,
      message: "Interview saved successfully",
      data: interview,
    });
  } catch (error) {
    console.error("Save Interview Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save interview",
    });
  }
};

export const evaluateInterview = async (req, res) => {
  try {
    const { interviewConfig, answers } = req.body;

    if (
      !interviewConfig ||
      !interviewConfig.role ||
      !Array.isArray(answers) ||
      answers.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Interview information and answers are required.",
      });
    }

    const evaluation = await evaluateInterviewAnswers({
      interviewConfig,
      answers,
    });

    return res.status(200).json({
      success: true,
      message: "Interview evaluated successfully.",
      data: evaluation,
    });
  } catch (error) {
    console.error("Evaluate Interview Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to evaluate interview answers.",
    });
  }
};

export const getUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    });
  } catch (error) {
    console.error("Get Interviews Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch interviews",
    });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error("Get Interview Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch interview",
    });
  }
};