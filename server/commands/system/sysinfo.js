
export function sysinfoCommand() {
  return `
SYSTEM INFORMATION
------------------
Terminal  : SHIVAM-OS v1.0.2 (Stable)
Interface : browser-cli-xterm (WebTTY)
Platform  : Distributed Web Environment
Runtime   : Node.js ${process.version} (Server-Side)
Status    : ONLINE (Connected via Render)
Location  : Cloud-Edge (Global)

[ ENVIRONMENT ]
User      : guest@shivamxcodes
Host      : shivam-terminal-backend
Shell     : /usr/bin/web-zsh
Uptime    : ${Math.floor(process.uptime() / 60)}m ${Math.floor(process.uptime() % 60)}s

"Type 'help' to explore the system architecture."
`.trim();
}
