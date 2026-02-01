import fs from "fs";
import path from "path";
import { parsePDF } from "../../services/pdfParser.js";
import { analyzeATS } from "../../services/atsEngine.js";
import {  getAIFeedback } from "../../services/groqFeedback.js";

/**
 * @param {Array} args - Command arguments
 * @param {Object|null} uploadedFile - The file buffer from memory
 */
export async function resumeCommand(args, uploadedFile) {
  const subcommand = args[0];
  const filename = args[1];

  if (subcommand !== "ats") {
    return "usage: resume ats <resume.pdf>";
  }

  let buffer;

  // 1. Priority: Browser upload
  if (uploadedFile ) {
    buffer = uploadedFile.buffer;
  }
  // 2. Fallback: Local file resolution
  else if (filename) {
    const possiblePaths = [
      path.resolve(process.cwd(), "commands", filename),
      path.resolve(process.cwd(), "server", "commands", filename),
      path.resolve(process.cwd(), "resume", filename),
      path.resolve(process.cwd(), "commands", "resume", filename),
    ];

    const filePath = possiblePaths.find((p) => fs.existsSync(p));

    if (!filePath) {
      return `Error: File '${filename}' not found.`;
    }

    console.log(`[SERVER] Found resume at: ${filePath}`);
    buffer = fs.readFileSync(filePath);
  } else {
    return "Please provide a resume PDF file name.";
  }

  try {
    const text = await parsePDF(buffer);
    const atsResult = analyzeATS(text);

    const missingText =
      atsResult.missing.length > 0
        ? atsResult.missing.map((m) => `- ${m}`).join("\n")
        : "None detected";

    const aiFeedback = await getAIFeedback(text, atsResult);

    return `
ATS SCORE
---------
${atsResult.score} / 100

ATS FEEDBACK
------------
${atsResult.feedback.length > 0 ? atsResult.feedback.join("\n") : "Looking good!"}

WEAK / MISSING AREAS
-------------------
${missingText}

DETECTED KEYWORDS
-----------------
${atsResult.foundKeywords.join(", ")}

AI FEEDBACK (Groq)
-----------------
${aiFeedback}

NOTE: AI is used only for suggestions, not evaluation.
`.trim();
  } catch (err) {
    console.error("Resume Processing Error:", err);
    return `Error processing PDF: ${err.message}`;
  }
}
