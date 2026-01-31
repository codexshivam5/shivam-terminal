import Groq from "groq-sdk";

/**
 * Groq-based AI feedback for resume ATS analysis
 */
export async function getAIFeedback(resumeText, atsResult) {
  console.log(
    "DEBUG: Current API Key starts with:",
    process.env.GROQ_API_KEY?.substring(0, 5),
  );

  if (!process.env.GROQ_API_KEY) {
    return "• AI feedback unavailable (GROQ_API_KEY not configured)";
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

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
    const result = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const raw = result.choices?.[0]?.message?.content || "";
    return sanitizeToBullets(raw);
  } catch (err) {
    console.error("GROQ API ERROR:", err);
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
        .replace(/^[-*•\d.)]+/, "")
        .replace(/\*\*/g, "")
        .trim(),
    )
    .filter(Boolean)
    .slice(0, 6)
    .map((line) => `• ${line}`)
    .join("\n");
}
