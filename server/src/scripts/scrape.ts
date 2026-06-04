import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs-extra";
import path from "path";

import { SOURCE_URLS } from "../data/sourceUrls";

async function scrapePage(url: string) {
    const response = await axios.get(url, {
  headers: {
    "User-Agent":
      "FrenchRevolutionRAGBot/1.0 (Educational Project)",
  },
});
    const $ = cheerio.load(response.data);

    const title = $("h1").first().text();

    let content = "";

    $(".mw-parser-output p").each((_, element) => {
        const paragraph = $(element).text().trim();

        if (paragraph.length > 0) {
            content += paragraph + "\n";
        }
    });

    return {
        title,
        url,
        content,
    };
}

async function main() {
  const articles = [];

  for (const url of SOURCE_URLS) {
    console.log(`Scraping: ${url}`);

    try {
      const article = await scrapePage(url);

      articles.push(article);

      console.log(`Done ${article.title}`);
    } catch (error) {
      console.error(` Failed: ${url}`);
      console.error(error);
    }
  }

  console.log("\n====================");
  console.log(`Articles Scraped: ${articles.length}`);
  console.log("====================\n");

    const outputPath = path.join(__dirname, "../data/articles.json");

    await fs.writeJSON(outputPath, articles, { spaces: 2 });

    console.log(`Saved ${articles.length} articles to ${outputPath}`);
}

main();