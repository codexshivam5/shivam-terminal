import fs from "fs";
import path from "path";
import { parsePDF } from "../../services/pdfParser.js";
import { analyzeATS } from "../../services/atsEngine.js";
import { getGeminiFeedback } from "../../services/geminiFeedback.js";

/**
 * @param {Array} args - Command arguments
 * @param {Object|null} uploadedFile - The file buffer from memory (if uploaded via browser)
 */
export async function resumeCommand(args, uploadedFile) {
  const subcommand = args[0];
  const filename = args[1];

  if (subcommand !== "ats") {
    return "usage: resume ats <resume.pdf>";
  }

  let buffer;

  // 1. Priority: Check if the user just uploaded a file via the browser
  if (uploadedFile && uploadedFile.originalname === filename) {
    buffer = uploadedFile.buffer;
  }
  // 2. Fallback: Check the local server/commands folder (for your manual testing)
  else if (filename) {
    const filePath = path.resolve(
      process.cwd(),
      "server",
      "commands",
      filename,
    );
    if (fs.existsSync(filePath)) {
      buffer = fs.readFileSync(filePath);
    } else {
      return `Error: File '${filename}' not found. Please upload it first or ensure it exists in server/commands/`;
    }
  } else {
    return "Please provide a resume PDF file name.";
  }

  try {
    // Full resume text extraction
    const text = await parsePDF(buffer);

    // Rule-based ATS analysis
    const atsResult = analyzeATS(text);

    const missingText =
      atsResult.missing.length > 0
        ? atsResult.missing.map((m) => `- ${m}`).join("\n")
        : "None detected";

    // 🤖 Gemini 2.5 feedback
    const aiFeedback = await getGeminiFeedback(text, atsResult);

    return `
ATS SCORE
---------
${atsResult.score} / 100

ATS FEEDBACK
------------
${atsResult.feedback.length > 0 ? atsResult.feedback.join("\n") : "Looking good! No major issues detected."}

WEAK / MISSING AREAS
-------------------
${missingText}

DETECTED KEYWORDS
-----------------
${atsResult.foundKeywords.length > 0 ? atsResult.foundKeywords.join(", ") : "No specific technical keywords detected."}

AI FEEDBACK (Gemini 2.5)
-----------------------
${aiFeedback}

NOTE
----
Rule-based ATS scoring.
AI is used only for feedback, not evaluation.
`.trim();
  } catch (err) {
    console.error("Resume Processing Error:", err);
    return `Error processing PDF: ${err.message}`;
  }
}
