import { encode, decode } from 'gpt-tokenizer';
import fs from "fs-extra";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Chunk } from "../types/chunk";

export function chunkText(
    text: string,
    chunkSize: number = 300,
    overlap = 50
) {
    const tokens = encode(text);

    const chunks: string[] = [];

    for(
        let i = 0;
        i < tokens.length;
        i += chunkSize - overlap
    ) {
        const chunkTokens = tokens.slice(i, i + chunkSize);
        const chunkText = decode(chunkTokens);
        chunks.push(chunkText);
    }
    return chunks;
}

async function main() {
  const filePath = path.join(
    __dirname,
    "../data/articles.json"
  );

  const articles = await fs.readJson(filePath);

  const allChunks: Chunk[] = [];

  for (const article of articles) {

    if (!article.content?.trim()) {
  console.log(
    `Skipping ${article.title} (empty content)`
  );
  continue;
}

    const chunks = chunkText(article.content);

    chunks.forEach((chunk, index) => {
      allChunks.push({
        id: uuidv4(),
        articleTitle: article.title,
        sourceUrl: article.url,
        chunkIndex: index,
        content: chunk,
      });
    });

    console.log(
      `Done ${article.title}: ${chunks.length} chunks`
    );
  }

  const outputPath = path.join(
    __dirname,
    "../data/chunks.json"
  );

  await fs.writeJson(outputPath, allChunks, {
    spaces: 2,
  });

  console.log("\n====================");
  console.log(
    `Total Chunks Created: ${allChunks.length}`
  );
  console.log("====================");
}

main().catch((error) => {
  console.error(error);
});