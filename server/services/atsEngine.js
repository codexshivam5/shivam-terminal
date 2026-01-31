export function analyzeATS(text) {
  let score = 0;
  const feedback = [];
  const missing = [];

  const lower = text.toLowerCase();

  /* ----------------------------
     1. CONTACT INFORMATION
  ----------------------------- */
  const hasEmail = /@/.test(text);
  const hasPhone = /\b\d{10}\b/.test(text);

  if (hasEmail && hasPhone) {
    score += 10;
    feedback.push("✔ Contact details found");
  } else {
    missing.push("Complete contact details (email + phone)");
  }

  /* ----------------------------
     2. SKILLS SECTION
  ----------------------------- */
  if (lower.includes("skills")) {
    score += 15;
    feedback.push("✔ Skills section detected");
  } else {
    missing.push("Skills section");
  }

  /* ----------------------------
     3. PROJECTS / EXPERIENCE
  ----------------------------- */
  const projectCount = (lower.match(/\bproject\b/g) || []).length;

  if (projectCount >= 2) {
    score += 20;
    feedback.push(`✔ ${projectCount} projects detected`);
  } else if (projectCount === 1) {
    score += 10;
    feedback.push("✔ 1 project detected");
    missing.push("More project experience");
  } else {
    missing.push("Projects or experience section");
  }

  /* ----------------------------
     4. EDUCATION
  ----------------------------- */
  if (
    lower.includes("education") ||
    lower.includes("bachelor") ||
    lower.includes("b.tech") ||
    lower.includes("degree")
  ) {
    score += 10;
    feedback.push("✔ Education section found");
  } else {
    missing.push("Education details");
  }

  /* ----------------------------
     5. MEASURABLE IMPACT
  ----------------------------- */
  if (
    /%|\bimproved\b|\breduced\b|\bincreased\b|\boptimized\b|\bsaved\b/.test(
      lower,
    )
  ) {
    score += 10;
    feedback.push("✔ Measurable impact mentioned");
  } else {
    missing.push("Quantified achievements (numbers, impact)");
  }

  /* ----------------------------
     6. KEYWORDS (GROUPED)
  ----------------------------- */
  const keywordGroups = {
    languages: ["java", "python", "c\\+\\+", "javascript", "php"],
    frameworks: ["react", "node", "express", "spring"],
    databases: ["sql", "mysql", "mongodb"],
    tools: ["git", "github", "docker", "kubernetes", "aws", "linux"],
  };

  const foundKeywords = [];
  let keywordScore = 0;

  for (const group in keywordGroups) {
    for (const keyword of keywordGroups[group]) {
      const regex = new RegExp(`\\b${keyword}\\b`, "i");
      if (regex.test(text)) {
        const cleanKeyword = keyword.replace(/\\+/g, "+");
        if (!foundKeywords.includes(cleanKeyword)) {
          foundKeywords.push(cleanKeyword);
          keywordScore += 2;
        }
      }
    }
  }

  // Cap keyword contribution
  score += Math.min(keywordScore, 20);

  /* ----------------------------
     FINAL SCORE CAP
  ----------------------------- */
  if (score > 100) score = 100;

  return {
    score,
    feedback,
    missing,
    foundKeywords,
  };
}
