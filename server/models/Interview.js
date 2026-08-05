import mongoose from "mongoose";

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
      required: true,
    },

    numberOfQuestions: {
      type: Number,
      required: true,
    },

    questions: [
      {
        question: String,
        answer: {
          type: String,
          default: "",
        },
      },
    ],

    score: {
      type: Number,
      default: 0,
    },

    feedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Interview", interviewSchema);