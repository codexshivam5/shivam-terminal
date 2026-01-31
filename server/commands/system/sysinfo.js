import os from "os";

export function sysinfoCommand() {
  const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
  const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

  return `
SYSTEM INFORMATION
------------------
OS        : ${os.type()} ${os.release()}
Platform  : ${os.platform()}
Arch      : ${os.arch()}
Memory    : ${freeMem}GB / ${totalMem}GB free
Runtime   : Node.js ${process.version}
Shell     : webtty-v1.0.2
Interface : browser-cli-xterm
Status    : ONLINE
`.trim();
}
