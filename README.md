# HTX Budget 2024 AI Chatbot

This project is a chatbot application designed to answer queries related to the Singapore Budget 2024 using Retrieval-Augmented Generation (RAG). The application uses DataStax (Astra DB) for document storage and OpenAI's GPT-4 for response generation.

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

## Installation
1. Clone the repository:
```bash
    git clone https://github.com/Jlorj/HTX_AI_chatbot.git
```
2. Install dependencies:
```bash
    npm install
```

3. Create a `.env` file in the root directory with the following:
```env
    OPENAI_API_KEY=your_openai_api_key
    ASTRA_DB_NAMESPACE=your_astra_db_namespace
    ASTRA_DB_COLLECTION=your_astra_db_collection
    ASTRA_DB_API_ENDPOINT=your_astra_db_api_endpoint
    ASTRA_DB_APPLICATION_TOKEN=your_astra_db_application_token
```

4. Place all local PDF files in the `./documents` directory.

## Running the Application Locally
1. Start the application:
```bash
    npm run dev
```
2. Access the application at http://localhost:3000.

## Building and Running with Docker
1. Build the Docker image:
```bash
    docker build -t htx-ai-chatbot .
```

2. Run the Docker container:
```bash
    docker run -p 3000:3000 --env-file .env htx-ai-chatbot
```

## Updating API Key
To update the OpenAI API Key, modify the `.env` file and restart the application.


