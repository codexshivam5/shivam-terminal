import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { executeCommand } from "./routes/execute.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
dotenv.config();

const SERVER_START_TIME = Date.now();
const app = express();

// Updated CORS to be more specific for your Vite frontend
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

// A simple in-memory store for the last uploaded resume
let lastUploadedFile = null;

app.post("/execute", async (req, res) => {
  const { command } = req.body;

  try {
    // We pass the lastUploadedFile to the executor so the 'resume' command can use it
    const output = await executeCommand(command, lastUploadedFile);
    res.json({ output });
  } catch (error) {
    console.error("EXECUTE COMMAND ERROR ↓↓↓");
    console.error(error);
    res.json({ output: error.message });
  }
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Store the buffer and metadata so the 'resume' command can find it
    lastUploadedFile = {
      buffer: req.file.buffer,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
    };

    res.json({
      message: "File received and ready for analysis",
      filename: req.file.originalname,
    });
  } catch (err) {
    res.status(400).json({ error: "File upload failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

export { SERVER_START_TIME };
