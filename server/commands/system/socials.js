/**
 * Socials & Contact Command - Shivam
 */
export async function socialsCommand(args) {
  const socialLinks = [
    {
      id: "linkedin",
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/shivamxsingh/",
      desc: "Professional networking & experience",
    },
    {
      id: "github",
      name: "GitHub",
      url: "https://github.com/codexshivam5",
      desc: "Open-source projects & code repositories",
    },
    {
      id: "email",
      name: "Email",
      url: "mailto:shivam.kr.2214@gmail.com",
      desc: "Direct inquiry for collaborations",
    },
  ];

  if (args.length > 0) {
    const search = args[0].toLowerCase();
    const link = socialLinks.find((s) => s.id === search);

    if (link) {
      // Sends the __OPEN__ signal back to the Terminal.jsx
      return `__OPEN__:${link.id}`;
    }
    return `sh: social profile '${args[0]}' not found.`;
  }

  let output = "COMMUNICATION & SOCIAL CHANNELS\n";
  output += "==================================================\n\n";

  socialLinks.forEach((s) => {
    output += `• ${s.id.padEnd(10)} | ${s.desc}\n`;
  });

  output += "\nType 'socials <id>' (e.g., 'socials github') to open.";
  return output;
}
