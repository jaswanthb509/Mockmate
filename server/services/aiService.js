import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is missing. Add it to your server/.env file."
  );
}

const ai = new GoogleGenAI({
  apiKey,
});

const cleanAndParseJSON = (text) => {
  const cleanedText = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanedText);
};

export const generateInterviewQuestions = async (data) => {
  const prompt = `
Generate exactly ${data.numberOfQuestions} interview questions.

Role: ${data.role}
Company: ${data.company || "Not specified"}
Experience: ${data.experience}
Difficulty: ${data.difficulty}
Interview Type: ${data.interviewType}
Technology Stack: ${data.techStack || "Not specified"}

Generate questions appropriate for the specified role, experience level,
difficulty, interview type, company, and technology stack.

Return ONLY a valid JSON array in this format:

[
  {
    "question": "Question text here"
  }
]

Do not include markdown.
Do not include code fences.
Do not include any explanation outside the JSON.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const questions = cleanAndParseJSON(response.text);

    if (!Array.isArray(questions)) {
      throw new Error("AI did not return an array of questions.");
    }

    return questions;
  } catch (error) {
    console.error(
      "Question Generation Error:",
      error.message
    );

    throw new Error(
      "Failed to generate interview questions."
    );
  }
};

export const evaluateInterviewAnswers = async ({
  interviewConfig,
  answers,
}) => {
  const formattedAnswers = answers
    .map(
      (item, index) => `
Question ${index + 1}:
${item.question}

Candidate Answer:
${item.answer?.trim() || "No answer provided"}
`
    )
    .join("\n------------------------------\n");

  const prompt = `
You are an expert technical interviewer.

Evaluate the following mock interview performance.

Interview Details:

Role: ${interviewConfig.role}
Company: ${interviewConfig.company || "Not specified"}
Experience: ${interviewConfig.experience}
Difficulty: ${interviewConfig.difficulty}
Interview Type: ${interviewConfig.interviewType}
Technology Stack: ${interviewConfig.techStack || "Not specified"}

Candidate Responses:

${formattedAnswers}

Evaluate every answer based on:

- Technical correctness
- Relevance to the question
- Clarity of explanation
- Completeness
- Communication quality

Important rules:

- Give unanswered questions a score of 0.
- overallScore must be between 0 and 100.
- Each question score must be between 0 and 100.
- Return feedback for exactly ${answers.length} questions.
- Keep the feedback constructive and specific.
- Do not give credit to unanswered questions.

Return ONLY valid JSON in exactly this format:

{
  "overallScore": 75,
  "summary": "A concise overall performance summary.",
  "strengths": [
    "Strength 1",
    "Strength 2"
  ],
  "improvements": [
    "Improvement 1",
    "Improvement 2"
  ],
  "questionFeedback": [
    {
      "score": 80,
      "feedback": "Specific feedback for this answer."
    }
  ]
}

The questionFeedback array must contain exactly ${answers.length} items.

Do not include markdown.
Do not include code fences.
Do not include any text outside the JSON.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const evaluation = cleanAndParseJSON(response.text);

    if (
      typeof evaluation.overallScore !== "number" ||
      !Array.isArray(evaluation.questionFeedback)
    ) {
      throw new Error(
        "Invalid AI evaluation format."
      );
    }

    if (
      evaluation.questionFeedback.length !== answers.length
    ) {
      throw new Error(
        "AI returned an incorrect number of feedback items."
      );
    }

    evaluation.overallScore = Math.max(
      0,
      Math.min(100, Math.round(evaluation.overallScore))
    );

    evaluation.questionFeedback =
      evaluation.questionFeedback.map((item) => ({
        score: Math.max(
          0,
          Math.min(100, Math.round(Number(item.score) || 0))
        ),
        feedback:
          item.feedback ||
          "No detailed feedback was provided.",
      }));

    return evaluation;
  } catch (error) {
    console.error(
      "Interview Evaluation Error:",
      error.message
    );

    throw new Error(
      "Failed to evaluate interview answers."
    );
  }
};