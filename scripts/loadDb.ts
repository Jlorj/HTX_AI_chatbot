import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import OpenAI from "openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { readFileSync } from "fs";
import pdfParse from "pdf-parse";
import axios from "axios";
import "dotenv/config";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY
} = process.env;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY});
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT!, { namespace: ASTRA_DB_NAMESPACE });

const budget2024Data = [
    'https://www.mof.gov.sg/singapore-budget/budget-2024',
];

// Local PDF Paths to process 
const localPdfs = [
    '/annexb1.pdf' ,
    '/annexb2.pdf',
    '/annexc1.pdf',
    '/annexc2.pdf',
    '/annexd1.pdf',
    '/annexd2.pdf',
    '/annexe1.pdf',
    '/annexe2.pdf',
    '/annexf1.pdf',
    '/annexf2.pdf',
    '/annexf3.pdf',
    '/annexf4.pdf',
    '/annexg1.pdf',
    '/annexg2.pdf',
    '/annexh1.pdf',
    '/annexh2.pdf',
    '/annexi1.pdf',
    '/fy2024_budget_statement.pdf',
    '/fy2024_budget_debate_round_up_speech.pdf',
    '/fy2024_analysis_of_revenue_and_expenditure.pdf',
    '/revenue-and-expenditure-estimates-for-fy2024-2025.pdf',
    '/fy2024_budget_booklet_english.pdf',
    '/fy2024_support_for_singaporeans_english.pdf',
    '/fy2024_majulah_package_english.pdf',
    '/fy2024_support_for_families_english.pdf',
    '/fy2024_support_for_seniors_english.pdf',
    '/fy2024_disbursement_calendar_english.pdf',
    '/fy2024_supporting_businesses_and_driving_growth_english.pdf',
    '/fy2024_investing_in_our_people_english.pdf',
    '/fy2024_building_a_resilient_future_english.pdf',
    '/fy2024_changes_to_property_tax_english.pdf',
];

// Append "./documents" to each path
const localPdfsPath = localPdfs.map(path => `./documents${path}`);

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
})

const createCollection = async(similarityMetric: SimilarityMetric = "cosine") => {
    const res = await db.createCollection(ASTRA_DB_COLLECTION!, {
        vector: {
            dimension: 1536,
            metric: similarityMetric,
        }
    })
    console.log(res);
}

const scrapePage = async(url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true
        },
        gotoOptions: {
            waitUntil: "domcontentloaded"
        },
        evaluate: async (page, browser) => {
            const result = await page.evaluate(() => document.body.innerText)
            await browser.close()
            return result
        }
    });
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '');
}

const extractTextFromLocalPDF = async (filePath: string) => {
    const pdfBuffer = readFileSync(filePath);
    const pdfData = await pdfParse(pdfBuffer);
    return pdfData.text;
};

const loadSampleData = async() => {

    const collection = await db.collection(ASTRA_DB_COLLECTION!);

    // Process URLs
    for await ( const url of budget2024Data) {
        const content = await scrapePage(url);
        const chunks = await splitter.splitText(content);
        for await (const chunk of chunks) {
            const embedding = await openai.embeddings.create({ 
                model: "text-embedding-ada-002",
                input: chunk,
                encoding_format: "float" 
            })

            const vector = embedding.data[0].embedding;

            const res = await collection.insertOne({
                $vector: vector,
                text: chunk,
            })
            console.log(res)
        }
    }

    // Process Local PDFs
    for (const localPdf of localPdfsPath) {
        const localPdfText = await extractTextFromLocalPDF(localPdf);
        const localChunks = await splitter.splitText(localPdfText);

        for (const chunk of localChunks) {
            const embedding = await openai.embeddings.create({
                model: "text-embedding-ada-002",
                input: chunk
            });

            const vector = embedding.data[0].embedding;
            const res = await collection.insertOne({
                $vector: vector,
                text: chunk,
            });
            console.log(res);
        }
    }
}

createCollection().then(() => loadSampleData())

