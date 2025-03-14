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

## RAG Architecture
![RAG architecture](https://github.com/Jlorj/HTX_AI_chatbot/blob/main/Architecture%20Design.jpg)
1. Data Ingestion and Preprocessing:
- Web Scraping: The PuppeteerWebBaseLoader is used to scrape relevant content from the Singapore Budget 2024 website. This ensures that the latest information is available for retrieval.
- PDF Parsing: Local PDF documents related to the Singapore Budget 2024 are parsed using pdf-parse to extract text content. This allows for a comprehensive dataset that includes official documents and reports.
2. Text Embedding:
- OpenAI Embeddings: The extracted text content is converted into high-dimensional vectors using OpenAI's text-embedding-ada-002 model. These embeddings capture the semantic meaning of the text, enabling effective similarity comparisons.
3. Vector Database:
- DataStax Astra DB: The embeddings are stored in a vector database provided by DataStax Astra DB. This database supports efficient vector similarity searches, allowing for quick retrieval of relevant documents based on query embeddings.
4. Query Processing:
- Embedding Generation: When a user submits a query, it is converted into an embedding using the same OpenAI model.
- Similarity Search: The query embedding is used to search the vector database for the most similar documents. This ensures that the retrieved documents are contextually relevant to the query.
5. Response Generation:
- OpenAI GPT-4: The retrieved documents are provided as context to the GPT-4 model, which generates a coherent and informative response. The response is formatted using Markdown to enhance readability and structure.
6. Markdown Rendering:
- ReactMarkdown: The generated Markdown response is rendered in the frontend using the react-markdown library. This ensures that the response is displayed with proper formatting, including headings, lists, and bold text.
7. Rationale:
- Accuracy: By combining retrieval and generation, RAG ensures that responses are grounded in factual information while leveraging the generative capabilities of GPT-4 to provide coherent and contextually relevant answers.
- Efficiency: The use of embeddings and vector databases allows for efficient similarity searches, enabling quick retrieval of relevant documents.
- Comprehensiveness: The inclusion of both web-scraped content and local PDF documents ensures a comprehensive dataset that covers various aspects of the Singapore Budget 2024.
- User Experience: The use of Markdown formatting and the react-markdown library enhances the readability and structure of the responses, providing a better user experience.

## Prompts Design
The list of prompts used to interact with the LLM can be found [here](https://github.com/Jlorj/HTX_AI_chatbot/blob/main/Prompts%20Design.pdf)

## Requirements
- Node.js (v22.14.0) & npm
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
- Copy the `API Endpoint` and `Application Token` (under Overview), and `Keyspace`ie. your NAMESPACE (under Data Explorer) 

4. Create your [OpenAI](https://auth.openai.com/log-in) account:
- Ensure that you have sufficient credits in your account
- Create and copy the `API Key` 

5. Create Environment Variables File:
> **Note:** Never share your `.env` file or commit it to your GitHub repository. Ensure `.env` is added to your `.gitignore` file.

To copy the example environment file and prepare your `.env` file, run:
```bash
cp .env.example .env
```
*You can name the `ASTRA_DB_COLLECTION` however you would like

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
