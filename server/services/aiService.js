import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "Warning: GEMINI_API_KEY is missing. AI features will not work until it is added to server/.env."
  );
}

const ai = new GoogleGenAI({
  apiKey,
});

const MODEL_NAME = "gemini-2.5-flash";

const sleep = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

const cleanAndParseJSON = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("AI returned an empty response.");
  }

  const cleanedText = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanedText);
};

const generateContentWithRetry = async (
  prompt,
  maxRetries = 3
) => {
  let lastError;

  for (
    let attempt = 0;
    attempt <= maxRetries;
    attempt++
  ) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      return response;
    } catch (error) {
      lastError = error;

      const status =
        error.status ||
        error.response?.status;

      const shouldRetry =
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504;

      if (
        !shouldRetry ||
        attempt === maxRetries
      ) {
        throw error;
      }

      const delay =
        2000 * Math.pow(2, attempt);

      console.log(
        `AI request failed with status ${status}. Retrying in ${
          delay / 1000
        } seconds...`
      );

      await sleep(delay);
    }
  }

  throw lastError;
};

export const generateInterviewQuestions = async (
  data
) => {
  if (!apiKey) {
    throw new Error(
      "AI service is not configured. GEMINI_API_KEY is missing."
    );
  }

  const questionCount = Math.min(
    Math.max(
      Number(data.numberOfQuestions) || 10,
      1
    ),
    20
  );

  const prompt = `
You are MockMate AI, an expert interview coach.

Generate exactly ${questionCount} high-quality mock interview questions.

INTERVIEW CONFIGURATION:

Job Role: ${data.role}
Experience Level: ${data.experience}
Difficulty: ${data.difficulty}
Interview Type: ${data.interviewType}
Technology Stack: ${
    data.techStack || "Not specified"
  }
Target Company: ${
    data.company || "General interview preparation"
  }

QUESTION REQUIREMENTS:

1. Generate exactly ${questionCount} questions.
2. Make every question relevant to the selected role.
3. Match the experience level and difficulty.
4. Avoid duplicate questions.
5. Generate realistic mock interview questions.
6. Do not include answers or explanations.

For Technical interviews:
Focus on programming, computer science,
frameworks, debugging, architecture,
problem-solving, and relevant technologies.

For HR interviews:
Focus on communication, teamwork,
leadership, conflict resolution,
motivation, strengths, weaknesses,
and workplace scenarios.

For Mixed interviews:
Generate a balanced combination
of Technical and HR questions.

Return ONLY valid JSON in exactly this format:

{
  "questions": [
    {
      "question": "Question text here"
    }
  ]
}
`;

  try {
    const response =
      await generateContentWithRetry(prompt);

    const parsedResponse =
      cleanAndParseJSON(response.text);

    const questions = Array.isArray(
      parsedResponse.questions
    )
      ? parsedResponse.questions
      : [];

    if (questions.length === 0) {
      throw new Error(
        "No interview questions were generated."
      );
    }

    return questions
      .filter((item) => {
        if (typeof item === "string") {
          return item.trim().length > 0;
        }

        return (
          item &&
          typeof item.question === "string" &&
          item.question.trim().length > 0
        );
      })
      .map((item) => {
        if (typeof item === "string") {
          return {
            question: item.trim(),
          };
        }

        return {
          question: item.question.trim(),
        };
      })
      .slice(0, questionCount);
  } catch (error) {
    console.error(
      "Question Generation Error:",
      error.message
    );

    if (error.status === 429) {
      throw new Error(
        "AI request limit reached. Please wait a moment and try again."
      );
    }

    if (error.status === 503) {
      throw new Error(
        "AI service is currently busy. Please try again in a moment."
      );
    }

    throw new Error(
      error.message ||
        "Failed to generate interview questions."
    );
  }
};

export const evaluateInterviewAnswers = async ({
  interviewConfig,
  answers,
}) => {
  if (!apiKey) {
    throw new Error(
      "AI service is not configured. GEMINI_API_KEY is missing."
    );
  }

  const formattedAnswers = answers
    .map(
      (item, index) => `
Question ${index + 1}:
${item.question}

Candidate Answer:
${item.answer?.trim() || "No answer provided"}
`
    )
    .join(
      "\n------------------------------\n"
    );

  const prompt = `
You are MockMate AI, an expert technical interviewer.

Evaluate the following mock interview performance.

INTERVIEW DETAILS:

Role: ${interviewConfig.role}
Company: ${
    interviewConfig.company || "Not specified"
  }
Experience: ${interviewConfig.experience}
Difficulty: ${interviewConfig.difficulty}
Interview Type: ${interviewConfig.interviewType}
Technology Stack: ${
    interviewConfig.techStack || "Not specified"
  }

CANDIDATE RESPONSES:

${formattedAnswers}

Evaluate every answer based on:

- Technical correctness
- Relevance to the question
- Clarity of explanation
- Completeness
- Communication quality

IMPORTANT RULES:

- Give unanswered questions a score of 0.
- overallScore must be between 0 and 100.
- Each question score must be between 0 and 100.
- Return feedback for exactly ${answers.length} questions.
- Keep feedback constructive and specific.
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
`;

  try {
    const response =
      await generateContentWithRetry(prompt);

    const evaluation =
      cleanAndParseJSON(response.text);

    if (
      typeof evaluation.overallScore !==
        "number" ||
      !Array.isArray(
        evaluation.questionFeedback
      )
    ) {
      throw new Error(
        "Invalid AI evaluation format."
      );
    }

    if (
      evaluation.questionFeedback.length !==
      answers.length
    ) {
      throw new Error(
        "AI returned an incorrect number of feedback items."
      );
    }

    evaluation.overallScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(evaluation.overallScore)
      )
    );

    evaluation.questionFeedback =
      evaluation.questionFeedback.map(
        (item) => ({
          score: Math.max(
            0,
            Math.min(
              100,
              Math.round(
                Number(item.score) || 0
              )
            )
          ),
          feedback:
            item.feedback ||
            "No detailed feedback was provided.",
        })
      );

    evaluation.strengths = Array.isArray(
      evaluation.strengths
    )
      ? evaluation.strengths
      : [];

    evaluation.improvements = Array.isArray(
      evaluation.improvements
    )
      ? evaluation.improvements
      : [];

    evaluation.summary =
      evaluation.summary ||
      "Your interview performance has been evaluated.";

    return evaluation;
  } catch (error) {
    console.error(
      "Interview Evaluation Error:",
      error.message
    );

    if (error.status === 429) {
      throw new Error(
        "AI request limit reached. Please wait a moment and try again."
      );
    }

    if (error.status === 503) {
      throw new Error(
        "AI evaluation service is currently busy. Please try again in a moment."
      );
    }

    throw new Error(
      error.message ||
        "Failed to evaluate interview answers."
    );
  }
};

export const analyzeResumeWithAI = async (
  resumeText
) => {
  if (!apiKey) {
    throw new Error(
      "AI service is not configured. GEMINI_API_KEY is missing."
    );
  }

  if (
    !resumeText ||
    typeof resumeText !== "string" ||
    resumeText.trim().length < 20
  ) {
    throw new Error(
      "The resume does not contain enough readable text to analyze."
    );
  }

  const prompt = `
You are MockMate AI, an expert resume reviewer and career coach.

Analyze the following resume and provide
a detailed, constructive evaluation.

RESUME CONTENT:

${resumeText}

Evaluate the resume based on:

1. Overall resume quality
2. Professional summary and career objective
3. Technical and professional skills
4. Education
5. Projects and work experience
6. Achievements and certifications
7. Resume clarity and readability
8. ATS keyword optimization
9. Missing or weak areas
10. Interview readiness

SCORING RULES:

- resumeScore must be an integer between 0 and 100.
- Give realistic scores.
- Do not give a perfect score unless the resume is exceptionally strong.
- strengths must contain useful positive observations.
- improvements must contain specific actionable improvements.
- missingSkills should contain relevant skills that could strengthen the candidate's profile.
- suggestions must contain practical steps the candidate can take.

Return ONLY valid JSON in exactly this format:

{
  "resumeScore": 75,
  "summary": "A concise overall analysis of the resume.",
  "strengths": [
    "Strength 1",
    "Strength 2",
    "Strength 3"
  ],
  "improvements": [
    "Improvement 1",
    "Improvement 2",
    "Improvement 3"
  ],
  "missingSkills": [
    "Skill 1",
    "Skill 2"
  ],
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ],
  "sectionScores": {
    "profile": 70,
    "skills": 75,
    "experience": 65,
    "projects": 80,
    "education": 85,
    "atsOptimization": 70
  }
}
`;

  try {
    const response =
      await generateContentWithRetry(prompt);

    const analysis =
      cleanAndParseJSON(response.text);

    if (
      typeof analysis.resumeScore !==
      "number"
    ) {
      throw new Error(
        "AI returned an invalid resume score."
      );
    }

    analysis.resumeScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(analysis.resumeScore)
      )
    );

    analysis.summary =
      typeof analysis.summary === "string"
        ? analysis.summary
        : "Your resume has been analyzed successfully.";

    analysis.strengths = Array.isArray(
      analysis.strengths
    )
      ? analysis.strengths.filter(
          (item) =>
            typeof item === "string" &&
            item.trim().length > 0
        )
      : [];

    analysis.improvements = Array.isArray(
      analysis.improvements
    )
      ? analysis.improvements.filter(
          (item) =>
            typeof item === "string" &&
            item.trim().length > 0
        )
      : [];

    analysis.missingSkills = Array.isArray(
      analysis.missingSkills
    )
      ? analysis.missingSkills.filter(
          (item) =>
            typeof item === "string" &&
            item.trim().length > 0
        )
      : [];

    analysis.suggestions = Array.isArray(
      analysis.suggestions
    )
      ? analysis.suggestions.filter(
          (item) =>
            typeof item === "string" &&
            item.trim().length > 0
        )
      : [];

    const defaultSectionScores = {
      profile: 0,
      skills: 0,
      experience: 0,
      projects: 0,
      education: 0,
      atsOptimization: 0,
    };

    const receivedSectionScores =
      analysis.sectionScores || {};

    analysis.sectionScores = {};

    Object.keys(
      defaultSectionScores
    ).forEach((key) => {
      const score = Number(
        receivedSectionScores[key]
      );

      analysis.sectionScores[key] = Math.max(
        0,
        Math.min(
          100,
          Number.isFinite(score)
            ? Math.round(score)
            : 0
        )
      );
    });

    return analysis;
  } catch (error) {
    console.error(
      "Resume AI Analysis Error:",
      error.message
    );

    if (error.status === 429) {
      throw new Error(
        "AI request limit reached. Please wait a moment and try again."
      );
    }

    if (error.status === 503) {
      throw new Error(
        "AI service is currently busy. Please try again in a moment."
      );
    }

    throw new Error(
      error.message ||
        "Failed to analyze the resume."
    );
  }
};