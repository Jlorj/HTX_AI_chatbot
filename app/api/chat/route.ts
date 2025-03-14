import OpenAI from "openai";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { DataAPIClient } from "@datastax/astra-db-ts";

const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY
} = process.env;

const openAI= new OpenAI({ 
    apiKey: OPENAI_API_KEY
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

export async function POST(req: Request) {
    try {
        const { messages } = await req.json()

        const latestMessage = messages[messages?.length - 1]?.content

        let docContext = "";

        const embedding = await openAI.embeddings.create({
            model: "text-embedding-ada-002",
            input: latestMessage,
            encoding_format: "float"
        })

        try {
            const collection = await db.collection(ASTRA_DB_COLLECTION!);
            const cursor = collection.find(null, {
                sort: {
                    $vector: embedding.data[0].embedding,
                },
                limit: 10,
            
            })
            const documents = await cursor.toArray()

            const docsMap = documents?.map(doc => doc.text)

            docContext = JSON.stringify(docsMap)

            console.log(docContext)

        } catch (err) {
            console.log("Error querying db...")
            docContext = ""
        }

        const template = {
            role: "system", 
            content: `
          You are an AI assistant with expert knowledge of the Singapore Budget 2024.
          
          Use the information below to answer questions. If the context doesn't provide enough details, use your general knowledge but always mention the source of your information or acknowledge what is missing.
          
          ### Response Guidelines:
          - If the context provides sufficient information, base your answer solely on it.
          - If the context is lacking, fill in with your knowledge, but be clear about the source of the information.
          - Format your response using **Markdown** where applicable (headings, lists, bold, italics, etc.), but avoid including images.
          
          ---
          **START CONTEXT**  
          ${docContext}  
          **END CONTEXT**
          ---
          
          **QUESTION:**  
          ${latestMessage}
          
          Please answer in a clear and structured manner. If possible, use markdown to highlight important points.
          
          `
          };

        const response = await streamText({
            model: openai("gpt-4"),
            messages: [template, ...messages]
        })
        
        return response.toDataStreamResponse();
            
    } catch (err) {
        throw err
        // return new Response("Error processing request", { status: 500 });
    }
}