import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import { MongoClient } from "mongodb";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

async function main() {
  const question = "Who was Robespierre?";

  const embeddingResponse = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: question,
  });

  const queryEmbedding =
    embeddingResponse.embeddings?.[0]?.values;

  if (!queryEmbedding) {
    throw new Error("Failed to generate query embedding");
  }

  console.log("Query embedding generated");

  const client = new MongoClient(
    process.env.MONGODB_URI!
  );

  await client.connect();

  const db = client.db("french_rag");

  const collection = db.collection("vectors");

  // Vector search
  const results = await collection
    .aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 50,
          limit: 5,
        },
      },
      {
        $project: {
          _id: 0,
          articleTitle: 1,
          chunkIndex: 1,
          content: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ])
    .toArray();

  console.log("\n🔍 Search Results:\n");

  results.forEach((result, index) => {
    console.log(`Result ${index + 1}`);
    console.log(`Title: ${result.articleTitle}`);
    console.log(`Chunk: ${result.chunkIndex}`);
    console.log(`Score: ${result.score}`);
    console.log(
      `Content Preview: ${result.content.substring(0, 300)}...`
    );
    console.log(
      "--------------------------------------------------"
    );
  });

  await client.close();
}

main().catch((error) => {
  console.error("Error:", error);
});