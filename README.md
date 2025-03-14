## Description

This project is a chatbot application designed to answer queries related to the Singapore Budget 2024 using Retrieval-Augmented Generation (RAG). The application uses DataStax (Astra DB) for document storage and OpenAI's GPT-4 for response generation.

## Features

Retrieval of relevant information from online and local PDFs.

Vector-based similarity search using Astra DB.

Query processing and response generation using OpenAI GPT-4.

## Requirements

Node.js & npm

Docker (for containerization)

## Installation

Clone the repository:

    git clone https://github.com/Jlorj/HTX_AI_chatbot.git

Install dependencies:

    npm install

Create a .env file in the root directory with the following:

    OPENAI_API_KEY=your_openai_api_key
    ASTRA_DB_NAMESPACE=your_astra_db_namespace
    ASTRA_DB_COLLECTION=your_astra_db_collection
    ASTRA_DB_API_ENDPOINT=your_astra_db_api_endpoint
    ASTRA_DB_APPLICATION_TOKEN=your_astra_db_application_token

Place all local PDF files in the ./documents directory.

Running the Application Locally

    npm run dev

Building and Running with Docker

Create a Dockerfile in the root directory:

    FROM node:18

    WORKDIR /app

    COPY package*.json ./
    RUN npm install

    COPY . .

    EXPOSE 3000

    CMD [ "npm", "run", "dev" ]

Build the Docker image:

    docker build -t mas-teda-chatbot .

Run the Docker container:

    docker run -p 3000:3000 --env-file .env mas-teda-chatbot


Updating API Key

To update the OpenAI API Key, modify the .env file and restart the application.
