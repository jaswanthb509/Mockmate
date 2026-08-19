import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateInterviewQuestions = async (data) => {
  const prompt = `
Generate ${data.numberOfQuestions} interview questions.

Role: ${data.role}
Experience: ${data.experience}
Difficulty: ${data.difficulty}
Interview Type: ${data.interviewType}
Technology Stack: ${data.techStack}

Return ONLY a valid JSON array.

Example:

[
  {
    "question":"Explain React Hooks."
  },
  {
    "question":"What is Event Loop?"
  }
]
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text;

    // Remove markdown code fences if Gemini returns them
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate interview questions.");
  }
};