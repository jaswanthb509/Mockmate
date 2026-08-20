import { GoogleGenAI } from "@google/genai";

const generateAIQuestions = async (req, res) => {
  try {
    const {
      role,
      experience,
      difficulty,
      interviewType,
      numberOfQuestions,
      techStack,
      company,
    } = req.body;

    if (!role || !experience || !difficulty || !interviewType) {
      return res.status(400).json({
        success: false,
        message: "Missing required interview configuration.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "AI service is not configured properly.",
      });
    }

    const questionCount = Number(numberOfQuestions) || 10;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are an expert interview question generator.

Generate exactly ${questionCount} interview questions based on the following interview configuration.

Job Role: ${role}
Experience Level: ${experience}
Difficulty: ${difficulty}
Interview Type: ${interviewType}
Technology Stack: ${techStack || "Not specified"}
Target Company: ${company || "General interview preparation"}

Rules:

1. Generate exactly ${questionCount} questions.
2. Questions must match the specified job role.
3. Questions must be appropriate for the experience level.
4. Questions must match the selected difficulty.
5. For Technical interviews, focus on technical concepts, problem-solving, frameworks, technologies, and the provided technology stack.
6. For HR interviews, focus on behavioral, communication, teamwork, motivation, strengths, weaknesses, and workplace situations.
7. For Mixed interviews, provide a balanced combination of Technical and HR questions.
8. If a target company is provided, tailor the questions to relevant skills and a plausible interview style.
9. Do not claim that these are actual confidential questions from the company.
10. Return only the questions.

Return the response as valid JSON in exactly this format:

{
  "questions": [
    "Question 1",
    "Question 2"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text?.trim();

    if (!responseText) {
      throw new Error("AI returned an empty response.");
    }

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error(
        "AI returned invalid JSON:",
        responseText
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to process the generated interview questions. Please try again.",
      });
    }

    const questions = Array.isArray(parsedResponse.questions)
      ? parsedResponse.questions
          .filter(
            (question) =>
              typeof question === "string" &&
              question.trim().length > 0
          )
          .map((question) => question.trim())
          .slice(0, questionCount)
      : [];

    if (questions.length === 0) {
      return res.status(500).json({
        success: false,
        message:
          "No interview questions were generated. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Interview questions generated successfully.",
      data: {
        questions,
      },
    });
  } catch (error) {
    console.error("AI Generation Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate your interview right now. Please try again in a moment.",
    });
  }
};

export default generateAIQuestions;