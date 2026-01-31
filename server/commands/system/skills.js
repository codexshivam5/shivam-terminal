/**
 * Skills Command - Shivam
 * Displays technical proficiency using ASCII progress bars.
 */
export async function skillsCommand() {
  const skills = [
    { name: "Java", level: 90 },
    { name: "C/C++", level: 85 },
    { name: "JavaScript", level: 80 },
    { name: "MERN Stack", level: 75 },
    { name: "SQL/MongoDB", level: 80 },
    { name: "PHP", level: 70 },
    { name: "Salesforce", level: 60 }, // Added as requested
  ];

  const createBar = (level) => {
    const filledLength = Math.round(level / 5);
    const bar = "█".repeat(filledLength) + "░".repeat(20 - filledLength);
    return `[${bar}] ${level}%`;
  };

  let output = "TECHNICAL PROFICIENCY MATRIX\n";
  output += "==================================================\n\n";

  skills.forEach((s) => {
    const label = s.name.padEnd(12);
    // "FEEDBACK" keyword triggers Yellow color in your Terminal logic
    output += `${label} : FEEDBACK ${createBar(s.level)}\n`;
  });

  output += "\nSystem Status: READY\n";
  output +=
    "Specialties  : Problem Solving, Full-Stack Development, MVC Architecture";

  return output;
}
