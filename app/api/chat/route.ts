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

              Given the following context:

              ---
              **START CONTEXT**  
              ${docContext}  
              **END CONTEXT**
              ---
              
              Use the above context and the following guidelines to respond to user queries:
              
              ### Response Guidelines:
              - If the context provides sufficient information, base your answer solely on the context of the Singapore Budget 2024
              - If the user doesn't provide you enough details, give a description of what you already know from the above context about the Singapore Budget 2024.
                     Otherwise, prompt the user to include more details of his or her question.
              -- If the user's response is unclear, prompt the user to provide more details.
              - Format your response using **Markdown** where applicable (headings, lists, bold, italics, etc.), but avoid including images.
              - Use **bold** and **larger font size** for numbering in lists.
              - Your response should be returned in Markdown format. Wrap your response in triple backticks (\`\`\`) to indicate Markdown content.
              - If the user asks for a definition, provide a clear and concise explanation.
              - If the user asks for a list, provide a list of items.
              - If the user asks for a comparison, provide a clear comparison.
              - If the user asks for a reason, provide a clear reason.
              - If the user asks for a process, provide a step-by-step process.
              - If the user asks for a description, provide a clear description.
              - If the user asks for a summary, provide a clear summary.
              - If the user asks for a recommendation, provide a clear recommendation.
              
              - At the end of your response, ask the user if you have sufficiently answered their question, and prompt them to ask another question if necessary.
              - Provide your clear and concise response on another paragraph and highlighted in **bold**.
              - If necessary, provide a link to the source of your information.

              **QUESTION:**  
              ${latestMessage}
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