import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "dummy_key");

export const analyzeResume = async (resumeText, jobDescription) => {
  if (!API_KEY) {
    console.warn("No VITE_GEMINI_API_KEY found. Falling back to mock data.");
    return new Promise(resolve => setTimeout(() => resolve({
      score: 84,
      breakdowns: [
        { label: "Experience Match", score: 90, color: "var(--accent-secondary)" },
        { label: "Skills Density", score: 65, color: "#eab308" },
        { label: "Action Verbs", score: 85, color: "var(--accent-primary)" },
        { label: "Formatting (ATS)", score: 100, color: "var(--accent-secondary)" }
      ],
      missingKeywords: ["Kubernetes", "Microservices", "CI/CD", "GraphQL", "Agile Leadership"],
      suggestions: [
        { type: "critical", text: "Add 'Kubernetes' and 'CI/CD' to your skills section to pass the primary ATS filter." },
        { type: "improvement", text: "Quantify your impact in the 'Software Engineer' role. E.g., 'Improved performance by X%'." },
        { type: "good", text: "Excellent use of action verbs in your recent experience." },
        { type: "improvement", text: "Shorten your professional summary. Keep it to 3 impactful sentences." }
      ]
    }), 2000));
  }

  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `
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

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from potential markdown block or conversational text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("AI returned non-JSON response:", responseText);
      throw new Error("Could not find valid JSON in AI response.");
    }
    
    const cleanedText = jsonMatch[0];
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error(`AI Error: ${error.message}`);
  }
};
