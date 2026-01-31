import axios from "axios";
import crypto from "crypto";

export const time = () => new Date().toLocaleTimeString();
export const date = () => new Date().toDateString();

export const uuid = () => crypto.randomUUID();

export const ip = async () => {
  try {
    const res = await axios.get("https://ipapi.co/json/");
    return `
PUBLIC IP INFO
--------------
IP       : ${res.data.ip}
CITY     : ${res.data.city}
ORG      : ${res.data.org}
TIMEZONE : ${res.data.timezone}
`.trim();
  } catch (err) {
    return "Error: Unable to fetch IP metadata.";
  }
};

export const hash = (args) => {
  if (!args[0]) return "Usage: hash <text>";
  return crypto.createHash('sha256').update(args[0]).digest('hex');
};