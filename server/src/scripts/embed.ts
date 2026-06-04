import dotenv from "dotenv";
dotenv.config();

import fs from "fs-extra";
import path from "path";

import { GoogleGenAI } from "@google/genai";

import { MongoClient } from "mongodb";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

async function main() {
  const client = new MongoClient(
    process.env.MONGODB_URI!
  );

  await client.connect();

  const db = client.db("french_rag");

  const vectorsCollection =
    db.collection("vectors");

  const chunks = await fs.readJson(
    path.join(
      __dirname,
      "../data/chunks.json"
    )
  );

  let count = 0;

  for (const chunk of chunks) {
    count++;

    console.log(
      `Embedding ${count}/${chunk.chunklength}`
    );

    const response =
      await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: chunk.content,
      });

    const embedding =
      response.embeddings?.[0]?.values;

    await vectorsCollection.insertOne({
      articleTitle:
        chunk.articleTitle,
      sourceUrl:
        chunk.sourceUrl,
      chunkIndex:
        chunk.chunkIndex,
      content:
        chunk.content,
      embedding,
    });
  }

  console.log(
    "Finished inserting 10 vectors"
  );

  await client.close();
}

main().catch(console.error);