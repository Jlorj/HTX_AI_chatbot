# HTX Budget 2024 AI Chatbot

This project is a chatbot application designed to answer queries related to the Singapore Budget 2024 using Retrieval-Augmented Generation (RAG). The application uses DataStax (Astra DB) for document storage and OpenAI's GPT-4 for response generation.

## Features
- Retrieval of relevant information from online and local PDFs.
- Vector-based similarity search using Astra DB.
- Query processing and response generation using OpenAI GPT-4.

## Requirements
- Node.js & npm
- Docker (for containerization)

## Installation
1. Clone the repository:
```bash
    git clone <repo_url>
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
```bash
    npm run dev
```

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

