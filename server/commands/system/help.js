export function helpCommand(args = []) {
  if (
    args[0]?.toLowerCase() === "resume" &&
    args[1]?.toLowerCase() === "ats"
  ) {
    return `
📖 MANUAL ENTRY: RESUME ATS
--------------------------------------------------
USAGE: resume ats <filename.pdf>
DESC: Analyzes a PDF using rule-based ATS scoring
      and includes Groq AI feedback.
`.trim();
  }

  // ✅ help resume (generic, single-word)
  if (args[0]?.toLowerCase() === "resume" && !args[1]) {
    return `
📖 MANUAL ENTRY: RESUME
--------------------------------------------------
USAGE: resume ats <filename.pdf>
DESC: Resume analysis and ATS scoring.
TIP: Use 'help resume ats' for detailed usage.
`.trim();
  }
  
  const command = args[0];
  

  // Manual Page Data Store
  const manual = {
    // SYSTEM
    help: "Description: Display the user manual or info about a specific command.\nUsage: help <command>",
    uptime:
      "Description: Show how long the SHIVAM-OS kernel has been active.\nUsage: uptime",
    sysinfo:
      "Description: Display hardware, kernel version, and environment metadata.\nUsage: sysinfo",
    fetch:
      "Description: Display system summary and developer persona (NeoFetch style).\nUsage: fetch",
    clear:
      "Description: Purge the terminal screen and reset history view.\nUsage: clear",
    history:
      "Description: Show a list of commands executed in the current session.\nUsage: history",
    shutdown:
      "Description: Halt all system processes and power down the terminal.\nUsage: shutdown",
    stopwatch:
      "Description: Start, stop, or reset a system stopwatch.\nUsage: stopwatch <start|stop|reset>",

    // TOOLS
    qr: "Description: Generate a scannable QR code for a URL or text string.\nUsage: qr <text>\nExample: qr https://shivamxcodes.co.in",
    shorten:
      "Description: Shorten a long URL using the TinyURL service.\nUsage: shorten <url>",
    ascii:
      "Description: Return the ASCII decimal value of a provided character.\nUsage: ascii <char>",
    reverse:
      "Description: Reverse the order of characters in a string or sentence.\nUsage: reverse <text>",
    capitalize:
      "Description: Capitalize the first letter of every word in a sentence.\nUsage: capitalize <text>",
    uppercase:
      "Description: Convert all provided text to uppercase characters.\nUsage: uppercase <text>",
    translate:
      "Description: Translate text to a target language (ISO code).\nUsage: translate <text> <lang_code>\nExample: translate hello es",
    weather:
      "Description: Fetch real-time weather data for a specific city.\nUsage: weather <city>",
    ping: "Description: Send ICMP ECHO_REQUEST to network hosts.\nUsage: ping <host>",
    dns: "Description: Resolve DNS records for a given domain.\nUsage: dns <domain>",
    uuid: "Description: Generate a universally unique identifier (UUID v4).\nUsage: uuid",
    hash: "Description: Generate a SHA-256 hash for the provided text string.\nUsage: hash <text>",

    // USER / IDENTITY
    about:
      "Description: Display detailed identification and bio of the developer.\nUsage: about",
    projects:
      "Description: Access the active project directory and deployment links.\nUsage: projects or projects <id>",
    skills:
      "Description: Display a technical proficiency matrix with expertise levels.\nUsage: skills",
    college:
      "Description: Show academic credentials and B.Tech CSE details from LPU.\nUsage: college",
    socials:
      "Description: List all encrypted communication and social channels.\nUsage: socials",
    contact: "Description: Alias for the 'socials' command.\nUsage: contact",
    whoami:
      "Description: Display developer identity with a small ASCII avatar.\nUsage: whoami",
    theme:
      "Description: Change the terminal color scheme.\nUsage: theme <matrix|ocean|classic|dracula>",
    // RENAMED TO RESUME-ATS
    "resume ats":
      "Description: Launches a rule-based engine to analyze your resume PDF for scoring and feedback.\nUsage: resume ats <file.pdf>",
  };

  // 1. Logic for help <command> - Manual Entry View
  if (command && manual[command]) {
    // Handling the manual entry specifically for the resume-ats description
    if (
      command === "resume-ats" ||
      (command === "resume" && args[0] === "ats")
    ) {
      return `
📖 MANUAL ENTRY: RESUME ATS
--------------------------------------------------
USAGE: resume ats <filename.pdf>
DESC: Analyzes a PDF in the server/commands folder using rule-based scoring.
      Includes Groq AI feedback.`.trim();
    }

    return `
📖 MANUAL ENTRY: ${command.toUpperCase()}


// ⚠️ REDUNDANT LOGIC (kept intentionally)
// This block is never reached for `help resume ats` because multi-word
// commands are handled earlier in a case-insensitive manner.
// Kept for backward compatibility / documentation clarity.
--------------------------------------------------
${manual[command]}`.trim();
  }

  // 2. Grid Formatting Logic for Main Help Menu
  const allCommands = Object.keys(manual).sort();
  const columns = 4;
  const columnWidth = 18;
  const rows = Math.ceil(allCommands.length / columns);

  let gridOutput = `💡 SHIVAM-OS Terminal Help Menu:\n\n`;

  for (let i = 0; i < rows; i++) {
    let rowText = "";
    for (let j = 0; j < columns; j++) {
      const index = i + j * rows; // Vertical-first sorting
      if (index < allCommands.length) {
        rowText += allCommands[index].padEnd(columnWidth);
      }
    }
    gridOutput += rowText + "\n";
  }

  return `
${gridOutput}
💡 Tip:
 • Use 'help <command>' (e.g. help college) to see command details.
 • Use Tab for auto-completion and arrow keys (↑ ↓) to navigate history.
`.trim();
}
