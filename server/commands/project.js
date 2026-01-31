const projects = [
  {
    name: "Libas Collection",
    tech: "MERN Stack (MongoDB, Express, React, Node.js)",
    description:
      "A full-stack e-commerce platform for fashion. Features secure user authentication and a dynamic product catalog.",
    status: "Deployed on Render",
    link: "https://libas-collection.onrender.com", // Update with your actual link
  },
  {
    name: "Terminal Portfolio (SHIVAM-OS)",
    tech: "React, Node.js, Groq API",
    description:
      "An interactive, terminal-inspired OS portfolio with integrated ATS resume analysis and real-time system stats.",
    status: "In Development",
    link: "https://shivamxcodes.co.in",
  },
  {
    name: "Personal Portfolio v1",
    tech: "Vite, React, Vercel",
    description:
      "My primary web presence featuring custom DNS configuration via GoDaddy.",
    status: "Live",
    link: "https://shivam.me",
  },
];

export const handleProjects = () => {
  let output = "Searching for active deployments...\n\n";

  projects.forEach((p, index) => {
    output += `[${index + 1}] ${p.name.toUpperCase()}\n`;
    output += `    Tech Stack: ${p.tech}\n`;
    output += `    Description: ${p.description}\n`;
    output += `    Status: ${p.status}\n`;
    output += `    URL: ${p.link}\n\n`;
  });

  output += "Type 'open <project_number>' to visit the site.";
  return output;
};
