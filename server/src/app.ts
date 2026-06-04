import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, getDB } from "./config/db";
import { retrieveRelevantChunks } from "./services/retrieval";
import { GoogleGenAI } from "@google/genai";
import authRoutes from "./routes/auth";
import { auth, AuthRequest } from "./middleware/auth";
import { ObjectId } from "mongodb";
import rateLimit from "express-rate-limit";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const app = express();

app.use(cors());
app.use(express.json());

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 4,              // 4 requests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      "Rate limit exceeded. Please wait before sending another message.",
  },
});

app.get("/", (_req, res) => {
  res.send(
    "French Revolution RAG API Running"
  );
});

app.get(
  "/me",
  auth,
  async (req: AuthRequest, res) => {
    try {
      const db = getDB();

      const user = await db
        .collection("users")
        .findOne(
          {
            _id: new ObjectId(
              req.userId
            ),
          },
          {
            projection: {
              password: 0,
            },
          }
        );

      res.json(user);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to load user",
      });
    }
  }
);

const PORT = Number(process.env.PORT) || 5000;

app.post("/chat", chatLimiter, async (req, res) => {
  try {
    const {
      message,
      history = [],
    } = req.body;

    const chunks =
      await retrieveRelevantChunks(
        message
      );

    const context = chunks
      .map((chunk) => chunk.content)
      .join("\n\n");

    const conversationHistory =
      history
        .map(
          (msg: any) =>
            `${msg.role}: ${msg.content}`
        )
        .join("\n");

    const prompt = `
You are a French Revolution expert.

Answer ONLY using the provided context.

Format your answer in markdown.

Use:
- headings when appropriate
- bullet points when listing information
- bold text for important names

If the answer is not in the context, say:

"I could not find that information in my knowledge base."

Conversation History:
${conversationHistory}

Context:
${context}

Current Question:
${message}
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });

    res.json({
      answer: response.text,
      sources: [
        ...new Set(
          chunks.map(
            (chunk) =>
              chunk.articleTitle
          )
        ),
      ],
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

connectDB();

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
