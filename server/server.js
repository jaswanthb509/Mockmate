import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://mockmate-eight-xi.vercel.app",
  "https://mockmate-65yeov2pq-jaswanthb509s-projects.vercel.app",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(
    process.env.CLIENT_URL.replace(/\/$/, "")
  );
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      if (
        /^https:\/\/mockmate-[a-z0-9-]+-jaswanthb509s-projects\.vercel\.app$/i.test(
          normalizedOrigin
        )
      ) {
        return callback(null, true);
      }

      console.error("Blocked by CORS:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MockMate API is running...",
  });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "File is too large. Maximum allowed size is 5 MB."
          : err.message,
    });
  }

  if (
    err.message ===
    "Only PDF and DOCX resume files are allowed."
  ) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS origin not allowed.",
    });
  }

  return res.status(500).json({
    success: false,
    message:
      err.message || "Something went wrong on the server.",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `MockMate server running on port ${PORT}`
  );
});