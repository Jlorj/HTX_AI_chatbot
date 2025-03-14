# HTX Budget 2024 AI Chatbot

This project is a chatbot application designed to answer queries related to the Singapore Budget 2024 using Retrieval-Augmented Generation (RAG). The application uses DataStax (Astra DB) for document storage and OpenAI's GPT-4 for response generation. We will assume that all users of this app are English-speaking.

## Features
- User-friendly frontend built with Next.js.
- Backend API for handling queries and generating responses using GPT-4.
- Integration with Astra DB for vector similarity search to retrieve relevant documents.
- Streaming text effect for displaying responses.
- Markdown rendering for enhanced readability.

## Components
- Frontend: Next.js application handling user interactions and displaying results.
- Backend: API handling requests, embeddings, context retrieval, and generating responses.
- Database: Astra DB storing document embeddings for context retrieval.
- External APIs: OpenAI API for embeddings and text generation.

## Requirements
- Node.js & npm
- Docker (for containerization)
- Datastax account
- OpenAI account

## Installation
1. Clone the repository:
```bash
    git clone https://github.com/Jlorj/HTX_AI_chatbot.git
```
2. Install dependencies:
```bash
    npm install
```

3. Create your [Datastax](https://www.datastax.com/) account:
- Click on `Create Database` and fill in the necessary fields
- Copy the `API Endpoint`, `Application Token` and `keyspace` (under Data Explorer)

4. Create your OpenAPI account:
- Ensure that you have sufficient credits in your account
- Create and copy the `API Key` 

5. Create Environment Variables File:
> **Note:** Never share your `.env` file or commit it to your GitHub repository. Ensure `.env` is added to your `.gitignore` file.

To copy the example environment file and prepare your `.env` file, run:
```bash
cp .env.example .env
```
You can name the AstraDB collection name however you would like

6. Store files in AstraDB for contextual information (this process might take a while):
```bash
npm run seed
```

## Running the Application Locally
1. Start the application:
```bash
    npm run dev
```
2. Access the application at http://localhost:3000.

## Running with Docker (ensure you have Docker installed)
1. Build and run the application:
```bash
    docker-compose up --build
```
2. Access the application at http://localhost:3000.
