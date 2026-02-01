import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getBanner } from "../utils/banner";

const Terminal = () => {
  // ✅ Core States
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isBooting, setIsBooting] = useState(true);
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const [isShutdown, setIsShutdown] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleString());
  const [locationData, setLocationData] = useState({
    city: "Detecting...",
    temp: "",
  });

  // ✅ Theme Logic (Cyber-Vapor Neon Palette)
  const [theme, setTheme] = useState("matrix");
  const themes = {
    matrix: {
      bg: "#0b0e14",
      text: "#00f2ff" /* Electric Cyan */,
      prompt: "#ff007a" /* Neon Pink */,
    },
    ocean: { bg: "#011627", text: "#82aaff", prompt: "#ecc48d" },
    classic: { bg: "#ffffff", text: "#000000", prompt: "#d32f2f" },
    dracula: { bg: "#282a36", text: "#f8f8f2", prompt: "#50fa7b" },
    cyber: {
      bg: "#000000",
      text: "#ff00ff" /* Hot Pink */,
      prompt: "#00ffff" /* Cyan */,
    },
  };

  const commands = [
    "help",
    "about",
    "projects",
    "skills",
    "college",
    "socials",
    "contact",
    "resume",
    "clear",
    "shutdown",
    "stopwatch",
    "weather",
    "translate",
    "qr",
    "shorten",
    "ascii",
    "reverse",
    "whoami",
    "theme",
  ];

  // ✅ Refs
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const swInterval = useRef(null);

  // ✅ Stopwatch Logic
  const [swActive, setSwActive] = useState(false);
  const [swTime, setSwTime] = useState(0);

  // 🧪 Ghost Text Suggestion Logic
  useEffect(() => {
    if (input) {
      const match = commands.find((c) => c.startsWith(input.toLowerCase()));
      setSuggestion(match && match !== input.toLowerCase() ? match : "");
    } else {
      setSuggestion("");
    }
  }, [input]);

  // 🎨 CSS Variable Sync
  useEffect(() => {
    const root = document.documentElement;
    const colors = themes[theme];
    root.style.setProperty("--bg-color", colors.bg);
    root.style.setProperty("--text-color", colors.text);
    root.style.setProperty("--prompt-color", colors.prompt);
  }, [theme]);

  // ⏱️ Stopwatch Timer
  useEffect(() => {
    if (swActive) {
      swInterval.current = setInterval(() => setSwTime((t) => t + 10), 10);
    } else {
      clearInterval(swInterval.current);
    }
    return () => clearInterval(swInterval.current);
  }, [swActive]);

  const formatSwTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const centi = Math.floor((ms / 10) % 100);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centi.toString().padStart(2, "0")}`;
  };

  // 🔌 Boot Sequence
  useEffect(() => {
    if (isShutdown) return;
    const bootLines = [
      "Establishing connection to SHIVAM-OS...",
      "Loading kernel modules...",
      "Detecting hardware: B.Tech CSE Environment Found.",
      "Initializing MERN stack drivers...",
      "Syncing with LPU academic database...",
      "System Ready.",
    ];
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootLines.length) {
        setHistory((prev) => [
          ...prev,
          { type: "output", content: `> ${bootLines[currentLine]}` },
        ]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setHistory([{ type: "output", content: getBanner() }]);
          setIsBooting(false);
        }, 800);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [isShutdown]);

  // ⏰ System Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🌍 Weather & Geo
  useEffect(() => {
    const getStats = async () => {
      try {
        const geo = await axios.get("https://ipapi.co/json/");
        const weather = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${geo.data.latitude}&longitude=${geo.data.longitude}&current_weather=true`,
        );
        setLocationData({
          city: geo.data.city,
          temp: `${Math.round(weather.data.current_weather.temperature)}°C`,
        });
      } catch {
        setLocationData({ city: "Ludhiana", temp: "22°C" });
      }
    };
    getStats();
  }, []);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  // ⌨️ Command Execution
  const handleExecute = async (e) => {
    if (isBooting || isShutdown) return;

    if (e.key === "Enter") {
      const fullCmd = input.trim();
      const [cmd, ...args] = fullCmd.toLowerCase().split(" ");
      if (!fullCmd) return;

      setHistory((prev) => [...prev, { type: "prompt", content: fullCmd }]);
      setCommandHistory((prev) => [fullCmd, ...prev]);
      setHistoryPointer(-1);
      setInput("");
      setSuggestion("");

      if (cmd === "clear") {
        setHistory([]);
        return;
      }

      if (cmd === "theme") {
        const selectedTheme = args[0];
        if (themes[selectedTheme]) {
          setTheme(selectedTheme);
          setHistory((p) => [
            ...p,
            { type: "output", content: `Theme changed to ${selectedTheme}.` },
          ]);
          return;
        }
        setHistory((p) => [
          ...p,
          {
            type: "output",
            content: `Available themes: ${Object.keys(themes).join(", ")}`,
          },
        ]);
        return;
      }

      if (cmd === "shutdown") {
        setHistory((p) => [
          ...p,
          {
            type: "output",
            content: "Broadcasting shutdown signal... System halted.",
          },
        ]);
        setTimeout(() => {
          setIsShutdown(true);
          setIsBooting(true);
          setHistory([]);
        }, 1200);
        return;
      }

      if (cmd === "stopwatch") {
        const sub = args[0];
        if (sub === "start") {
          setSwActive(true);
          return;
        }
        if (sub === "stop") {
          setSwActive(false);
          setHistory((p) => [
            ...p,
            {
              type: "output",
              content: `Stopwatch stopped at: ${formatSwTime(swTime)}`,
            },
          ]);
          return;
        }
        if (sub === "reset") {
          setSwActive(false);
          setSwTime(0);
          return;
        }
        setHistory((p) => [
          ...p,
          {
            type: "output",
            content: `Stopwatch: ${formatSwTime(swTime)}\nUsage: stopwatch <start|stop|reset>`,
          },
        ]);
        return;
      }

      if (fullCmd.toLowerCase().startsWith("resume ats")) {
        fileInputRef.current.click();
        return;
      }

      try {
        const res = await axios.post(
          "https://shivam-terminal.onrender.com/execute",
          {
            command: fullCmd,
            clientData:{
              location: locationData.city,
              temp: locationData.temp,
            }
          },
        );
        if (res.data.output.startsWith("__OPEN__:")) {
          const id = res.data.output.split(":")[1];
          const urls = {
            libas: "https://lnkd.in/gXfy_RVf",
            portfolio: "https://shivamxcodes.co.in",
            github: "https://github.com/codexshivam5",
            linkedin: "https://www.linkedin.com/in/shivamxsingh/",
            t2f: "https://github.com/codexshivam5/T2F-Travels",
            email: "mailto:shivam.kr.2214@gmail.com",
            clock:
              "https://github.com/codexshivam5/WorldClockApplicationEnhanced",
          };
          if (urls[id]) window.open(urls[id], "_blank");
          return;
        }
        setHistory((prev) => [
          ...prev,
          { type: "output", content: res.data.output },
        ]);
      } catch {
        setHistory((prev) => [
          ...prev,
          { type: "output", content: "Error: No response from server." },
        ]);
      }
    }

    if (e.key === "Tab" && suggestion) {
      e.preventDefault();
      setInput(suggestion);
      setSuggestion("");
      return;
    }

    if (e.key === "ArrowUp" && historyPointer < commandHistory.length - 1) {
      const p = historyPointer + 1;
      setHistoryPointer(p);
      setInput(commandHistory[p]);
    }
    if (e.key === "ArrowDown") {
      const p = historyPointer - 1;
      if (p >= 0) {
        setHistoryPointer(p);
        setInput(commandHistory[p]);
      } else {
        setHistoryPointer(-1);
        setInput("");
      }
    }
  };

  // 🚀 ATS Scanning Animation Logic
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Initial Output
    setHistory((p) => [
      ...p,
      {
        type: "output",
        content: `[SYSTEM] Initializing Analysis for: ${file.name}...`,
      },
    ]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("https://shivam-terminal.onrender.com/upload", formData);

      // Progress Bar Simulation
      let progress = 0;
      const scanInterval = setInterval(() => {
        progress += 10;
        if (progress <= 100) {
          const bar = "#".repeat(progress / 5) + ".".repeat(20 - progress / 5);
          setHistory((p) => {
            const newHistory = [...p];
            const lastIdx = newHistory.length - 1;
            newHistory[lastIdx] = {
              type: "output",
              content: `SCANNING: [${bar}] ${progress}%`,
            };
            return newHistory;
          });
        } else {
          clearInterval(scanInterval);
          // Fetch final results after animation
          setTimeout(async () => {
            const res = await axios.post(
              "https://shivam-terminal.onrender.com/execute",
              {
                command: `resume ats ${file.name}`,
              },
            );
            setHistory((p) => [
              ...p,
              { type: "output", content: res.data.output },
            ]);
          }, 500);
        }
      }, 100);
    } catch {
      setHistory((p) => [
        ...p,
        { type: "output", content: "CRITICAL ERROR: Analysis Engine Failure." },
      ]);
    }
    e.target.value = null;
  };

  const renderContent = (content) => {
    if (!content) return "";
    return content.split("\n").map((text, index) => {
      if (text.startsWith("__IMG__:")) {
        return (
          <div key={index} className="qr-container">
            <img
              src={text.replace("__IMG__:", "").trim()}
              alt="QR"
              className="qr-image"
            />
          </div>
        );
      }
      const upperLine = text.toUpperCase();
      let lineClass = "";
      if (upperLine.includes("WEAK") || upperLine.includes("MISSING"))
        lineClass = "weak-text-line";
      if (upperLine.includes("SCORE") || upperLine.includes("FEEDBACK"))
        lineClass = "good-text-line";
      return (
        <div key={index} className={lineClass}>
          {text}
        </div>
      );
    });
  };

  return (
    <div className={`main-wrapper ${isShutdown ? "system-off" : ""}`}>
      <div className="top-bar">
        <span>
          {locationData.city} | {locationData.temp}
        </span>
        <span className="url-center">shivamxcodes.co.in</span>
        <span>
          {new Date().toLocaleDateString()} {time}
        </span>
      </div>

      <div
        className="terminal-container"
        onClick={() =>
          !isBooting &&
          !isShutdown &&
          document.querySelector(".terminal-input").focus()
        }
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden-file-input"
          accept=".pdf"
          onChange={handleFileUpload}
        />

        {isShutdown ? (
          <div
            className="shutdown-overlay"
            onClick={() => setIsShutdown(false)}
          >
            <div className="off-content">
              <p className="blink">[ SYSTEM HALTED ]</p>
              <p>Click screen to reboot...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="terminal-body" ref={scrollRef}>
              {history.map((line, i) => (
                <div key={i} className={`line ${line.type}`}>
                  {line.type === "prompt" && (
                    <span className="prompt-prefix">shivam@codes:~$ </span>
                  )}
                  <pre className="content">{renderContent(line.content)}</pre>
                </div>
              ))}
              {!isBooting && (
                <div className="input-line">
                  <span className="prompt-prefix">shivam@codes:~$ </span>
                  <div className="input-wrapper">
                    <span className="suggestion-text">{suggestion}</span>
                    <input
                      className="terminal-input"
                      autoFocus
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleExecute}
                      spellCheck="false"
                      autoComplete="off"
                    />
                  </div>
                </div>
              )}
            </div>
            {swActive && (
              <div className="live-stopwatch">
                <span className="blink">●</span> STOPWATCH:{" "}
                {formatSwTime(swTime)}
              </div>
            )}
          </>
        )}
      </div>

      <div className="bottom-bar">
        <span>© 2026 Shivam Singh | LPU Graduate</span>
        <button
          className={`power-btn ${isShutdown ? "off" : "on"}`}
          onClick={() => setIsShutdown(!isShutdown)}
        >
          ⏻ {isShutdown ? "POWER ON" : "SHUTDOWN"}
        </button>
      </div>
    </div>
  );
};

export default Terminal;
