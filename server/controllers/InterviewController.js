import Interview from "../models/Interview.js";
import {
  evaluateInterviewAnswers,
} from "../services/aiService.js";

export const saveInterview = async (
  req,
  res
) => {
  try {
    const {
      role,
      company,
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
        message:
          "Missing required interview information.",
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message:
          "Interview answers must be an array.",
      });
    }

    const interview =
      await Interview.create({
        user: req.user._id,
        role,
        company: company || "",
        experience,
        difficulty,
        interviewType,
        techStack: techStack || "",
        totalQuestions: Number(totalQuestions),
        answeredQuestions:
          Number(answeredQuestions) || 0,
        completionScore:
          Number(completionScore) || 0,
        answers,
      });

    console.log(
      "Interview saved successfully:",
      interview._id.toString()
    );

    return res.status(201).json({
      success: true,
      message:
        "Interview saved successfully.",
      data: interview,
    });
  } catch (error) {
    console.error(
      "Save Interview Error:"
    );

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to save interview.",
    });
  }
};

export const evaluateInterview = async (
  req,
  res
) => {
  try {
    const { interviewId } = req.body;

    console.log(
      "Evaluation request received."
    );

    console.log(
      "Interview ID:",
      interviewId
    );

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message:
          "Interview ID is required.",
      });
    }

    const interview =
      await Interview.findOne({
        _id: interviewId,
        user: req.user._id,
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found.",
      });
    }

    console.log(
      "Interview found:",
      interview._id.toString()
    );

    console.log(
      "Number of answers:",
      interview.answers.length
    );

    if (
      !Array.isArray(interview.answers) ||
      interview.answers.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This interview has no answers to evaluate.",
      });
    }

    if (
      interview.evaluation &&
      interview.evaluation.evaluatedAt
    ) {
      console.log(
        "Existing evaluation found. Returning saved evaluation."
      );

      return res.status(200).json({
        success: true,
        message:
          "Interview evaluation already exists.",
        data: interview.evaluation,
      });
    }

    const interviewConfig = {
      role: interview.role,
      company: interview.company,
      experience: interview.experience,
      difficulty: interview.difficulty,
      interviewType:
        interview.interviewType,
      techStack: interview.techStack,
    };

    console.log(
      "Starting AI evaluation..."
    );

    const evaluation =
      await evaluateInterviewAnswers({
        interviewConfig,
        answers: interview.answers,
      });

    interview.evaluation = {
      overallScore:
        evaluation.overallScore,
      summary: evaluation.summary,
      strengths:
        evaluation.strengths || [],
      improvements:
        evaluation.improvements || [],
      questionFeedback:
        evaluation.questionFeedback || [],
      evaluatedAt: new Date(),
    };

    await interview.save();

    console.log(
      "AI evaluation saved successfully."
    );

    return res.status(200).json({
      success: true,
      message:
        "Interview evaluated and saved successfully.",
      data: interview.evaluation,
    });
  } catch (error) {
    console.error(
      "Evaluate Interview Error:"
    );

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to evaluate interview answers.",
    });
  }
};

export const getUserInterviews = async (
  req,
  res
) => {
  try {
    const interviews =
      await Interview.find({
        user: req.user._id,
      })
        .sort({
          createdAt: -1,
        })
        .select(
          "role company experience difficulty interviewType techStack totalQuestions answeredQuestions completionScore evaluation createdAt"
        );

    return res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    });
  } catch (error) {
    console.error(
      "Get Interviews Error:"
    );

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch interviews.",
    });
  }
};

export const getInterviewById = async (
  req,
  res
) => {
  try {
    const interview =
      await Interview.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error(
      "Get Interview Error:"
    );

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch interview.",
    });
  }
};