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

    if (
      !role ||
      !experience ||
      !difficulty ||
      !interviewType
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required interview configuration.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message:
          "AI service is not configured properly.",
      });
    }

    const questionCount = Math.min(
      Math.max(Number(numberOfQuestions) || 10, 1),
      20
    );

    const cleanCompany =
      typeof company === "string"
        ? company.trim()
        : "";

    const cleanTechStack =
      typeof techStack === "string"
        ? techStack.trim()
        : "";

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const companyInstructions = cleanCompany
      ? `
COMPANY-SPECIFIC PREPARATION:

The candidate is preparing specifically for ${cleanCompany}.

Tailor the interview questions to the likely skills,
problem-solving expectations, engineering practices,
and interview themes relevant to a ${role} candidate
at ${cleanCompany}.

Important rules:
- Do NOT claim these are real, leaked, confidential,
  or exact questions from ${cleanCompany}.
- Generate original practice questions.
- Let the target company influence the style and focus
  of the questions.
`
      : `
GENERAL INTERVIEW PREPARATION:

No target company was provided.

Generate high-quality general interview questions
appropriate for the selected role and experience level.
`;

    const prompt = `
You are MockMate AI, an expert technical and behavioral
interview coach.

Generate exactly ${questionCount} high-quality mock
interview questions.

INTERVIEW CONFIGURATION:

Job Role: ${role}
Experience Level: ${experience}
Difficulty: ${difficulty}
Interview Type: ${interviewType}
Technology Stack: ${
      cleanTechStack || "Not specified"
    }
Target Company: ${
      cleanCompany || "General interview preparation"
    }

${companyInstructions}

QUESTION REQUIREMENTS:

1. Generate exactly ${questionCount} questions.
2. Every question must be relevant to the selected role.
3. Match the questions to the selected experience level.
4. Match the complexity to the selected difficulty.
5. Avoid duplicate or very similar questions.
6. Questions should be realistic for a mock interview.
7. Make every question clear and answerable.
8. Do not include answers, hints, explanations,
   numbering, markdown, or extra text.

INTERVIEW TYPE RULES:

For Technical:
- Focus on programming, computer science concepts,
  frameworks, architecture, debugging, problem-solving,
  and relevant technologies.
- Include conceptual and scenario-based questions.
- For Medium and Hard difficulty, test reasoning and
  practical decision-making.

For HR:
- Focus on communication, teamwork, conflict resolution,
  motivation, leadership, strengths, weaknesses,
  ownership, and workplace scenarios.
- Make behavioral questions realistic and specific.

For Mixed:
- Generate a balanced combination of Technical and HR
  questions.
- Keep the balance appropriate for the role and
  experience level.

TECH STACK RULES:

${
  cleanTechStack
    ? `The candidate provided this technology stack:
${cleanTechStack}.

Prioritize relevant technologies when appropriate.`
    : `No specific technology stack was provided.

Use technologies and concepts naturally relevant to the
selected job role.`
}

Return ONLY valid JSON in exactly this format:

{
  "questions": [
    "Question 1",
    "Question 2"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text?.trim();

    if (!responseText) {
      throw new Error(
        "AI returned an empty response."
      );
    }

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error(
        "AI returned invalid JSON:",
        responseText
      );

      throw new Error(
        "Unable to process the generated interview questions."
      );
    }

    const questions = Array.isArray(
      parsedResponse.questions
    )
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
      throw new Error(
        "No interview questions were generated."
      );
    }

    return res.status(200).json({
      success: true,
      message: cleanCompany
        ? `Company-focused interview questions generated for ${cleanCompany}.`
        : "Interview questions generated successfully.",
      data: {
        questions,
      },
    });
  } catch (error) {
    console.error(
      "AI Generation Error:",
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
        error.status === 503
          ? "AI is currently experiencing high demand. Please try again in a moment."
          : error.status === 429
          ? "AI request limit reached. Please wait a moment and try again."
          : error.message ||
            "Unable to generate your interview right now. Please try again.",
    });
  }
};

export default generateAIQuestions;