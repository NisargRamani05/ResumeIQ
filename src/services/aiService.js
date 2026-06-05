import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "dummy_key");

// Fallback model list if dynamic fetch fails — ordered by preference
const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-pro",
];

// Fetch the real list of models available for this API key and pick flash/pro ones
let _modelListCache = null;
async function getAvailableModels() {
  if (_modelListCache) return _modelListCache;
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    // Filter to models that support generateContent, prefer flash
    const names = (json.models || [])
      .filter(
        (m) =>
          m.supportedGenerationMethods?.includes("generateContent") &&
          /flash|pro/i.test(m.name)
      )
      .map((m) => m.name.replace("models/", ""))
      // Sort: flash-lite last, pro last, newest first
      .sort((a, b) => {
        const rank = (n) => {
          if (/2\.5.*flash(?!.*lite)/i.test(n)) return 0;
          if (/2\.0.*flash(?!.*lite)/i.test(n)) return 1;
          if (/flash-lite/i.test(n)) return 2;
          if (/pro/i.test(n)) return 3;
          return 4;
        };
        return rank(a) - rank(b);
      });
    console.log("[ATS] Available models:", names);
    _modelListCache = names.length ? names : FALLBACK_MODELS;
  } catch (err) {
    console.warn("[ATS] Could not list models, using fallback list:", err.message);
    _modelListCache = FALLBACK_MODELS;
  }
  return _modelListCache;
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Try a single model — retries on 503/429, throws immediately on 404/auth errors
async function tryModel(modelName, prompt, retries = 2) {
  const model = genAI.getGenerativeModel({ model: modelName });
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      const msg = err?.message || "";
      const isOverloaded =
        msg.includes("503") ||
        msg.includes("429") ||
        msg.includes("high demand") ||
        msg.includes("overloaded");
      const isNotFound = msg.includes("404") || msg.includes("not found");

      if (isNotFound) {
        // Model doesn't exist for this key — skip immediately, no retry
        const skipErr = new Error(`MODEL_NOT_FOUND: ${modelName}`);
        skipErr.skipToNext = true;
        throw skipErr;
      }

      if (isOverloaded && attempt < retries) {
        const delay = 1500 * Math.pow(2, attempt); // 1.5s → 3s
        console.warn(`[${modelName}] overloaded, retrying in ${delay}ms…`);
        await sleep(delay);
        continue;
      }
      throw err; // out of retries or unknown error
    }
  }
}

const buildPrompt = (resumeText, jobDescription) => `
You are an expert ATS (Applicant Tracking System) and senior technical recruiter. 
Your task is to analyze the provided resume text against the job description (if provided, otherwise just analyze the resume generally).

Here is the job description:
${jobDescription || "Not provided. Please evaluate the resume based on general industry best practices."}

Here is the resume text:
${resumeText}

Analyze the resume and return ONLY a valid JSON object matching the following structure exactly, with no additional markdown, text, or backticks outside of the JSON.

{
  "score": 85,
  "breakdowns": [
    { "label": "Experience Match", "score": 90, "color": "#10b981" },
    { "label": "Skills Density", "score": 70, "color": "#eab308" },
    { "label": "Action Verbs", "score": 85, "color": "#3b82f6" },
    { "label": "Formatting (ATS)", "score": 95, "color": "#8b5cf6" }
  ],
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "suggestions": [
    { "type": "critical", "text": "A critical suggestion." },
    { "type": "improvement", "text": "An improvement suggestion." },
    { "type": "good", "text": "A positive feedback." }
  ]
}

Make sure:
1. The overall score is out of 100.
2. Breakdowns have 4 categories. Assign colors according to their score (e.g. green for high, yellow for medium, red for low).
3. Extract up to 5-8 missing keywords.
4. Provide 4-6 actionable suggestions. Suggest what is wrong and what can be improved.
`;

export const analyzeResume = async (resumeText, jobDescription) => {
  if (!API_KEY) {
    console.warn("No VITE_GEMINI_API_KEY found. Falling back to mock data.");
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            score: 84,
            breakdowns: [
              { label: "Experience Match", score: 90, color: "#10b981" },
              { label: "Skills Density", score: 65, color: "#eab308" },
              { label: "Action Verbs", score: 85, color: "#3b82f6" },
              { label: "Formatting (ATS)", score: 100, color: "#8b5cf6" },
            ],
            missingKeywords: [
              "Kubernetes",
              "Microservices",
              "CI/CD",
              "GraphQL",
              "Agile Leadership",
            ],
            suggestions: [
              {
                type: "critical",
                text: "Add 'Kubernetes' and 'CI/CD' to your skills section to pass the primary ATS filter.",
              },
              {
                type: "improvement",
                text: "Quantify your impact in the 'Software Engineer' role. E.g., 'Improved performance by X%'.",
              },
              {
                type: "good",
                text: "Excellent use of action verbs in your recent experience.",
              },
              {
                type: "improvement",
                text: "Shorten your professional summary. Keep it to 3 impactful sentences.",
              },
            ],
          }),
        2000
      )
    );
  }

  const prompt = buildPrompt(resumeText, jobDescription);
  let lastError = null;

  // Fetch the real list of models available for this API key
  const modelList = await getAvailableModels();

  // Try each model in priority order
  for (const modelName of modelList) {
    try {
      console.log(`[ATS] Trying model: ${modelName}`);
      const responseText = await tryModel(modelName, prompt);

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error(`[${modelName}] Non-JSON response:`, responseText);
        throw new Error("Could not find valid JSON in AI response.");
      }

      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      const msg = err?.message || "";
      const shouldSkip =
        err.skipToNext ||
        msg.includes("503") ||
        msg.includes("429") ||
        msg.includes("high demand") ||
        msg.includes("overloaded") ||
        msg.startsWith("MODEL_NOT_FOUND");

      lastError = err;
      if (shouldSkip) {
        console.warn(`[${modelName}] skipping → ${msg.slice(0, 80)}`);
        continue;
      }
      // Auth errors, parse errors, etc. — fail fast
      throw new Error(`AI Error: ${err.message}`);
    }
  }

  // All models exhausted
  throw new Error(
    `All Gemini models are currently unavailable. Please try again in a moment.`
  );
};

