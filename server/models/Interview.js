import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      default: "",
    },
  },
  { _id: false }
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
    },

    answeredQuestions: {
      type: Number,
      default: 0,
    },

    completionScore: {
      type: Number,
      default: 0,
    },

    answers: [answerSchema],
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;