import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      default: "",
    },
    answer: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const questionFeedbackSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const evaluationSchema = new mongoose.Schema(
  {
    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    summary: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },

    questionFeedback: {
      type: [questionFeedbackSchema],
      default: [],
    },

    evaluatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      default: "",
      trim: true,
    },

    experience: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      required: true,
    },

    interviewType: {
      type: String,
      required: true,
    },

    techStack: {
      type: String,
      default: "",
    },

    totalQuestions: {
      type: Number,
      required: true,
      default: 0,
    },

    answeredQuestions: {
      type: Number,
      default: 0,
    },

    completionScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    answers: {
      type: [answerSchema],
      default: [],
    },

    evaluation: {
      type: evaluationSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model(
  "Interview",
  interviewSchema
);

export default Interview;