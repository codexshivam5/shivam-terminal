import { SERVER_START_TIME } from "../../index.js";

export function uptimeCommand() {
  if (!SERVER_START_TIME) return "Uptime: unknown (start time not recorded)";

  const diffMs = Date.now() - SERVER_START_TIME;
  const diffSecs = Math.floor(diffMs / 1000);
  
  const days = Math.floor(diffSecs / 86400);
  const hours = Math.floor((diffSecs % 86400) / 3600);
  const minutes = Math.floor((diffSecs % 3600) / 60);
  const seconds = diffSecs % 60;

  let output = "up ";
  if (days > 0) output += `${days}d `;
  if (hours > 0) output += `${hours}h `;
  if (minutes > 0) output += `${minutes}m `;
  output += `${seconds}s`;

  return output;
}