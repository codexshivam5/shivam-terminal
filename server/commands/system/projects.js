/**
 * Projects Command - Shivam
 * Includes live links for LinkedIn, GitHub, and Project Deployments.
 */
export async function projectsCommand(args) {
  const projectList = [
    {
      id: "libas",
      name: "Libas Collection",
      tech: "MERN Stack, JWT, Render",
      desc: "Luxury e-commerce platform with admin dashboard and secure auth.",
      link: "https://lnkd.in/gXfy_RVf",
      duration: "Sep 2025 – Oct 2025",
    },
    {
      id: "t2f",
      name: "T2F - Trip Planner",
      tech: "PHP, MVC, MySQL",
      desc: "Comprehensive itinerary management and secure session handling.",
      link: "https://github.com/codexshivam5/T2F-Travels", // Updated with your GitHub
      duration: "Feb 2025 – May 2025",
    },
    {
      id: "clock",
      name: "World Clock GUI",
      tech: "Java, Swing/AWT",
      desc: "Real-time global synchronization with dark/light mode toggle.",
      link: "https://github.com/codexshivam5/WorldClockApplicationEnhanced",
      duration: "June 2025 – July 2025",
    },
    {
      id: "portfolio",
      name: "Main Portfolio",
      tech: "Vite, React, Vercel",
      desc: "My primary GUI portfolio featuring custom DNS and clean UI.",
      link: "https://shivamxcodes.co.in",
      duration: "Ongoing",
    },
  ];

  // Logic for 'project <id>'
  if (args.length > 0) {
    const search = args[0].toLowerCase();
    const p = projectList.find(
      (item) => item.id === search || item.name.toLowerCase().includes(search),
    );

    if (p) {
      return `
[ PROJECT: ${p.name.toUpperCase()} ]
--------------------------------------------------
DURATION    : ${p.duration}
TECH STACK  : ${p.tech}
DESCRIPTION : ${p.desc}
LIVE LINK   : ${p.link}
--------------------------------------------------
Type 'open ${p.id}' to launch in a new tab.`;
    }
    return `sh: project '${args[0]}' not found.`;
  }

  // Logic for 'projects' (List all)
  let output = "ACTIVE PROJECT DIRECTORY\n";
  output += "==================================================\n";
  output +=
    "SOCIALS: github.com/codexshivam5 | linkedin.com/in/shivamxsingh/\n";
  output += "==================================================\n\n";

  projectList.forEach((p) => {
    output += `• ${p.id.padEnd(10)} | ${p.name}\n`;
  });

  output += "\nType 'projects <id>' (e.g., 'projects libas') for details.";
  return output;
}
