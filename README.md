# French Revolution RAG Chatbot

A Retrieval-Augmented Generation (RAG) chatbot focused on the French Revolution. The project combines semantic search, vector embeddings, MongoDB Atlas Vector Search, and Google's Gemini API to provide context-aware answers grounded in a curated knowledge base.

This project was primarily built as a learning exercise to understand the practical implementation of RAG systems, including document ingestion, embedding generation, vector search, retrieval pipelines, authentication, and frontend-backend integration.


## Live Demo
🌐 https://french-revolution-rag-chatbot.vercel.app
---

## Features

### RAG-Based Question Answering
- Retrieves relevant historical context from a curated French Revolution knowledge base.
- Uses vector embeddings and semantic search to find related information.
- Generates answers using Gemini while grounding responses in retrieved documents.

### Authentication
- User signup and login.
- JWT-based authentication.
- Protected chat routes.

### Modern Chat Interface
- Multi-chat session support.
- Responsive UI built with React and Tailwind CSS.
- Markdown rendering for AI responses.
- Suggested starter questions.

### Rate Limiting
- Limits chat requests to 4 requests per minute.
- Helps prevent abuse and excessive API usage.

### Knowledge Retrieval
- MongoDB Atlas Vector Search.
- Embedding-based semantic retrieval.
- Context-aware prompting.

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- React Markdown
- Lucide React

### Backend
- Node.js
- Express
- TypeScript
- JWT Authentication
- Express Rate Limit

#### Frontend deployed on Vercel and backend deployed on Render.

### AI & Retrieval
- Google Gemini API
- MongoDB Atlas Vector Search
- Embedding-based Retrieval

### Database
- MongoDB Atlas

---

## Project Structure

```text
French-Revolution-RAG/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── main.tsx
│   │
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── app.ts
│   │
│   └── package.json
│
└── README.md
```

---

## How RAG Works in This Project

1. User submits a question.
2. The question is converted into an embedding.
3. MongoDB Atlas Vector Search retrieves the most relevant chunks.
4. Retrieved context is added to the prompt.
5. Gemini generates a grounded response.
6. The answer is returned to the chat interface.

```text
User Question
      ↓
Embedding Generation
      ↓
Vector Search
      ↓
Relevant Chunks Retrieved
      ↓
Prompt Construction
      ↓
Gemini Response
      ↓
Answer Displayed
```

---

## Learning Objectives

This project was built to gain hands-on experience with:

- Retrieval-Augmented Generation (RAG)
- Vector embeddings
- Semantic search
- MongoDB Atlas Vector Search
- JWT authentication
- Full-stack TypeScript development

---

## Future Improvements

- Source citations for generated answers.
- Hybrid retrieval (keyword + vector search).
- Better conversation memory.
- User-specific chat persistence.
- Improved retrieval evaluation.

---

## Disclaimer

This project is intended for educational and learning purposes. While responses are grounded in the provided knowledge base, generated content may occasionally contain inaccuracies and should not be treated as an authoritative historical source.
