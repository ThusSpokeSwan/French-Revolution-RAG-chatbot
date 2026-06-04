import { MongoClient, Db } from "mongodb";

let db: Db;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing");
  }

  const client = new MongoClient(uri);

  await client.connect();

  db = client.db("french_rag");

  console.log("MongoDB Connected");
}

export function getDB() {
  if (!db) {
    throw new Error("Database not initialized");
  }

  return db;
}