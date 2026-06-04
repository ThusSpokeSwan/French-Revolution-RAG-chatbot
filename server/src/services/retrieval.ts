import { GoogleGenAI } from "@google/genai";
import { getDB } from "../config/db";

export async function retrieveRelevantChunks(
  question: string
) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const embeddingResponse =
    await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: question,
    });

  const queryEmbedding =
    embeddingResponse.embeddings?.[0]?.values;

  if (!queryEmbedding) {
    throw new Error(
      "Failed to generate query embedding"
    );
  }

  const db = getDB();

  const collection =
    db.collection("vectors");

  const results = await collection
    .aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 50,
          limit: 15,
        },
      },
      {
        $project: {
          _id: 0,
          articleTitle: 1,
          sourceUrl: 1,
          content: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ])
    .toArray();

  const filteredResults = results.filter(
    (result) => result.score > 0.7
  );

  const articleCounts = new Map<
    string,
    number
  >();

  const diversifiedResults = [];

  for (const result of filteredResults) {
    const count =
      articleCounts.get(
        result.articleTitle
      ) || 0;

    if (count >= 2) {
      continue;
    }

    articleCounts.set(
      result.articleTitle,
      count + 1
    );

    diversifiedResults.push(result);
  }

  return diversifiedResults.slice(0, 5);
}