import { helpCommand } from "../commands/system/help.js";
import { uptimeCommand } from "../commands/system/uptime.js";
import { sysinfoCommand } from "../commands/system/sysinfo.js";
import { resumeCommand } from "../commands/resume/index.js";
import { tools } from "../commands/system/tools.js";
import { projectsCommand } from "../commands/system/projects.js";
import { skillsCommand } from "../commands/system/skills.js";
import { socialsCommand } from "../commands/system/socials.js";
import { collegeCommand } from "../commands/system/college.js";
import { fetchCommand } from "../commands/system/fetch.js";

// 1. Define the About logic as a reusable function to avoid ReferenceErrors
const aboutHandler = () => {
  return `
   _________________________
  |  _____________________  |
  | |       XXXXX         | |   IDENTIFICATION: SHIVAM SINGH
  | |      X     X        | |   STATUS        : B.Tech CSE (LPU)
  | |     (  O O  )       | |   LOCATION      : Punjab, India
  | |      |  ^  |        | |   SPECIALIZATION: Full-Stack & Salesforce
  | |      | '-' |        | |   VERSION       : 1.0.2-stable
  | |       XXXXX         | |
  | |_____________________| |   "I don't just write code; 
  |_________________________|    I design scalable systems."

[ BIO ]
"I am a CSE student focused on building scalable web solutions and 
robust software architectures. My journey involves mastering the 
MERN stack, Java, DSA, and Salesforce.

To see my technical proficiency and current life-progress,
run the 'skills' command."
`.trim();
};

const commandRegistry = {
  // System & Alias
  help: helpCommand,
  "?": helpCommand,
  uptime: uptimeCommand,
  sysinfo: sysinfoCommand,
  resume: resumeCommand,

  // Projects
  project: projectsCommand,
  projects: projectsCommand,

  // Identity
  about: aboutHandler,
  whoami: aboutHandler, // Now correctly references aboutHandler
  fetch: fetchCommand,
  neofetch: fetchCommand,
  college: collegeCommand,
  lpu: collegeCommand,

  // Skills & Socials
  skills: skillsCommand,
  socials: socialsCommand,
  contact: socialsCommand,

  // Tools from tools.js
  ascii: tools.ascii,
  capitalize: tools.capitalize,
  uppercase: tools.uppercase,
  reverse: tools.reverse,
  uuid: tools.uuid,
  hash: tools.hash,
  dns: tools.dns,
  shorten: tools.shorten,
  ping: tools.ping,
  weather: tools.weather,
  translate: tools.translate,
  qr: tools.qr,

  // Links & Shortcuts
  github: () => "__OPEN__:github",
  linkedin: () => "__OPEN__:linkedin",
  clear: () => "__CLEAR__",
  history: () =>
    "Terminal history functionality is handled on the client-side.",

  open: (args) => {
    if (!args[0]) return "Usage: open <project_id> (e.g., open libas)";
    return `__OPEN__:${args[0]}`;
  },
};

/**
 * Execute Command
 * @param {string} input
 * @param {Object|null} uploadedFile
 */
export async function executeCommand(input, uploadedFile = null) {
  if (!input || !input.trim()) return "";

  const tokens = input.trim().split(/\s+/);
  const rootCommand = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  const handler = commandRegistry[rootCommand];

  if (!handler) {
    return `sh: command not found: ${rootCommand}. Type 'help' for available commands.`;
  }

  try {
    const result = await handler(args, uploadedFile);

    if (result === "__CLEAR__") return "__CLEAR__";
    if (result === undefined || result === null) return "";

    return String(result);
  } catch (err) {
    console.error(`Command Error [${rootCommand}]:`, err);
    return `error: ${err.message || "internal execution failure"}`;
  }
}
