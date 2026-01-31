import axios from "axios";
import crypto from "crypto";

export const tools = {
  // 1. TEXT MANIPULATION
  ascii: (args) => {
    if (!args[0]) return "Usage: ascii <char>";
    return args[0]
      .split("")
      .map((char) => `'${char}': ${char.charCodeAt(0)}`)
      .join("\n");
  },
  whoami: () => {
    return `
  _____      USER: SHIVAM SINGH
 /     \\     ROLE: B.Tech CSE Student @ LPU
|  o o  |    FEEL: Full-Stack Developer
|   ^   |    GOAL: Building Scalable Systems
 \\V___V/     STATUS: Active & Coding...

"Run 'skills' to see the progress bar of my life."`;
  },

  capitalize: (args) => {
    if (args.length === 0) return "Usage: capitalize <text>";
    return args.join(" ").replace(/\b\w/g, (l) => l.toUpperCase());
  },

  uppercase: (args) => {
    if (args.length === 0) return "Usage: uppercase <text>";
    return args.join(" ").toUpperCase();
  },

  reverse: (args) => {
    if (args.length === 0) return "Usage: reverse <text>";
    return args.join(" ").split("").reverse().join("");
  },

  // 2. CRYPTO & ID GENERATION
  uuid: () => {
    return crypto.randomUUID();
  },

  hash: (args) => {
    if (!args[0]) return "Usage: hash <text>";
    return crypto.createHash("sha256").update(args.join(" ")).digest("hex");
  },

  // 3. NETWORK & WEB SERVICES
  dns: async (args) => {
    if (!args[0]) return "Usage: dns <domain>";
    try {
      const res = await axios.get(`https://dns.google/resolve?name=${args[0]}`);
      if (!res.data.Answer) return `No DNS records found for ${args[0]}`;
      return JSON.stringify(res.data.Answer, null, 2);
    } catch {
      return "Error: Could not resolve DNS.";
    }
  },

  shorten: async (args) => {
    if (!args[0]) return "Usage: shorten <url>";
    try {
      const res = await axios.get(
        `https://tinyurl.com/api-create.php?url=${args[0]}`,
      );
      return `Shortened URL: ${res.data}`;
    } catch {
      return "Error: TinyURL service failed.";
    }
  },

  ping: (args) => {
    const host = args[0] || "google.com";
    return `PING ${host} (142.250.190.46) 56(84) bytes of data.
64 bytes from ${host}: icmp_seq=1 ttl=117 time=14.2 ms
64 bytes from ${host}: icmp_seq=2 ttl=117 time=13.8 ms

--- ${host} ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1001ms`;
  },

  // 4. API DRIVEN TOOLS
  weather: async (args) => {
    const city = args[0] || "Amritsar";
    try {
      // Using wttr.in for terminal-friendly weather formatting
      const res = await axios.get(`https://api.wttr.in/${city}?format=3`);
      return res.data;
    } catch {
      return "Error: Weather service unreachable.";
    }
  },

  translate: async (args) => {
    if (args.length < 2) {
      return `
Usage: translate <text> <lang_code>

Examples:
  translate hello hi
  translate how are you fr

Supported language codes:
hi, es, fr, de, it, pt, ru, ja, ko, zh, ar,
bn, ta, te, ml, mr, pa, ur, gu, kn, or,
tr, vi, th, id, nl, pl, sv, no, da, fi,
el, he, fa
`.trim();
    }

    const lang = args.pop();
    const text = args.join(" ");

    try {
      const res = await axios.get(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text,
        )}&langpair=en|${lang}`,
      );

      return `Translation (${lang.toUpperCase()}): ${res.data.responseData.translatedText}`;
    } catch {
      return "Error: Translation failed.";
    }
  },

  qr: (args) => {
    if (!args[0]) return "Usage: qr <text>";
    const data = encodeURIComponent(args.join(" "));
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
    return `__IMG__:${url}`;
  },
};
