import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { analyzeResumeWithAI } from "../services/aiService.js";

const extractTextFromFile = async (file) => {
  const fileType = file.mimetype;

  if (fileType === "application/pdf") {
    const parser = new PDFParse({
      data: new Uint8Array(file.buffer),
    });

    try {
      const result = await parser.getText();

      const extractedText = result.text?.trim();

      if (!extractedText) {
        throw new Error(
          "No readable text was found in this PDF."
        );
      }

      return extractedText;
    } finally {
      await parser.destroy();
    }
  }

  if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    const extractedText = result.value?.trim();

    if (!extractedText) {
      throw new Error(
        "No readable text was found in this DOCX file."
      );
    }

    return extractedText;
  }

  throw new Error(
    "Unsupported file format. Please upload a PDF or DOCX file."
  );
};

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload a resume file before analysis.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message:
          "AI service is not configured properly.",
      });
    }

    console.log(
      `Analyzing resume: ${req.file.originalname}`
    );

    const resumeText = await extractTextFromFile(
      req.file
    );

    if (resumeText.length < 20) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to extract enough text from this resume.",
      });
    }

    console.log(
      `Extracted ${resumeText.length} characters from resume.`
    );

    const analysis = await analyzeResumeWithAI(
      resumeText,
      req.file.originalname
    );

    return res.status(200).json({
      success: true,
      message:
        "Resume analyzed successfully.",
      data: {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        analysis,
      },
    });
  } catch (error) {
    console.error(
      "Resume Analysis Error:",
      error
    );

    const statusCode =
      error.status === 429 ||
      error.status === 503
        ? 503
        : 500;

    return res.status(statusCode).json({
      success: false,
      message:
        error.message ||
        "Unable to analyze the resume. Please try again.",
    });
  }
};