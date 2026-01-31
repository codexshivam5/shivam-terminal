import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

export async function getGeminiFeedback(resumeText, atsResult) {
  if (!process.env.GEMINI_API_KEY) {
    return "• AI feedback unavailable (GEMINI_API_KEY not configured)";
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a senior technical recruiter.

Context:
- ATS Score: ${atsResult.score}
- Missing areas: ${atsResult.missing.join(", ") || "None"}
- Detected keywords: ${atsResult.foundKeywords.join(", ")}

Resume (trimmed):
"""
${resumeText.slice(0, 5000)}
"""

TASK:
Give 4–6 concise, actionable resume improvement suggestions.

STRICT RULES:
- Bullet points ONLY
- No headings
- No paragraphs
- No score
- No resume rewrite
- Each bullet must start with a dash (-)
- Max 1 line per bullet
`;

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    return sanitizeToBullets(raw);
  } catch (err) {
    return [
      "• AI feedback unavailable due to API error",
      "• ATS score and keyword analysis are still valid",
      "• Try again later or check API quota",
    ].join("\n");
  }
}

/* -------------------------------
   FORCE BULLET-ONLY OUTPUT
-------------------------------- */
function sanitizeToBullets(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(
      (line) =>
        line &&
        !line.toLowerCase().startsWith("here") &&
        !line.toLowerCase().includes("suggestion") &&
        !line.toLowerCase().includes("feedback"),
    )
    .map((line) =>
      line
        .replace(/^[-*•\d.)]+/, "") // remove bullets/numbers
        .replace(/\*\*/g, "") // remove bold
        .trim(),
    )
    .filter(Boolean)
    .slice(0, 6)
    .map((line) => `• ${line}`)
    .join("\n");
}
