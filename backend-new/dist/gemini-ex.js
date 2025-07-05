import { SchemaType } from "@google/generative-ai";
import { googleGenAi, createMcpClient } from "./googleAi.js";
const { client, transport } = await createMcpClient();
// Get available search tools
const { tools } = await client.listTools();
console.log(`Available tools: ${tools.map((t) => t.name).join(", ")}`);
// Configure function calling for Gemini
const model = googleGenAi.getGenerativeModel({
    model: "gemini-2.5-flash",
    tools: [
        {
            functionDeclarations: [
                {
                    name: "gdrive_read_file",
                    description: "Read a file from Google Drive using its Google Drive file ID (don't use exa nor brave to read files)",
                    parameters: {
                        type: SchemaType.OBJECT,
                        properties: {
                            file_id: {
                                type: SchemaType.STRING,
                                description: "The file's file ID (required)",
                            },
                        },
                        required: ["file_id"],
                    },
                },
                {
                    name: "gdrive_search",
                    description: "Search for files specifically in your Google Drive account (don't use exa nor brave to search for files)",
                    parameters: {
                        type: SchemaType.OBJECT,
                        properties: {
                            query: {
                                type: SchemaType.STRING,
                                description: "Search query",
                            },
                        },
                        required: ["query"],
                    },
                },
            ],
        },
    ],
    // toolConfig: {
    //     functionCallingConfig: {
    //         mode: 'any'
    //     }
    // }
});
// Handle function calling with MCP
async function handleFunctionCall(functionCall) {
    const { name, args } = functionCall;
    console.log(`🔍 Gemini requested tool: ${name}`);
    console.log(`📝 Function arguments: ${JSON.stringify(args)}`);
    // Call the appropriate MCP tool
    const result = await client.callTool({
        name,
        arguments: args,
    });
    return result.content[0].text;
}
// Process user queries with Gemini and MCP tools
export async function processQuery(userQuery, history) {
    console.log(`\n📝 User query: "${userQuery}"`);

    const systemPrompt = `You are an intelligent assistant that helps users answer questions using information stored in their Google Drive. You have secure, read-only access to the user's authorized files and can use Model Context Protocol (MCP) to retrieve relevant content from those files to provide accurate and context-aware responses. Use the chat history provided to contextualize the user queries, if provided.

    When answering questions:

    Search the user's Drive to find the most relevant documents based on the user's query.

    Use MCP to extract and understand key context from the documents.

    Base your answer only on the retrieved content — do not speculate or invent information.

    Highlight the specific file(s) where the information came from. Mention the filename and, if available, section titles or headings.

    Clearly separate your answer from the source references using a clean format.

    Return your output in markdown format for more clarity to the user.

    Make the source reference a different markdown style than the normal text to more distinctly differentiate the two.

    When a user tells you to read the contents of a file, first check if you’ve listed that file’s ID before in the chat history, and if so, call the gdrive_read_file tool provided to you on that file ID and summarize the contents in your response.

When a user tells you to list out relevant files to their query, call the gdrive_search tool and list out the files and their IDs in your response.

When a user asks a question, try to find the answer to the question in the google drive and find a document where it could be answered.

    If no relevant information is found, politely inform the user that nothing matching their query could be located in their Drive. The query is seen below: \n`;

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: systemPrompt + userQuery + '\nHistory:\n' + JSON.stringify(history) }] }],
        });
        const response = result.response;
        // Check if Gemini wants to call a function
        if (response.candidates &&
            response.candidates[0].content.parts[0].functionCall) {
            const functionCall = response.candidates[0].content.parts[0].functionCall;
            const searchResults = await handleFunctionCall(functionCall);
            // Send the function result back to Gemini
            const finalResult = await model.generateContent({
                contents: [
                    { role: "user", parts: [{ text: userQuery }] },
                    {
                        role: "model",
                        parts: [
                            {
                                functionCall: functionCall,
                            },
                        ],
                    },
                    {
                        role: "user",
                        parts: [
                            {
                                text: searchResults,
                            },
                        ],
                    },
                ],
            });
            return finalResult.response.text();
        }
        return response.text();
    }
    catch (error) {
        const errorMessage = typeof error === "object" && error !== null && "message" in error
            ? error.message
            : String(error);
        console.error(`Error processing query: ${errorMessage}`);
        return `Sorry, I encountered an error while processing your request: ${errorMessage || "Unknown error"}`;
    }
}
// Example 1: Using Gemini with function calling to access MCP tools
async function geminiWithFunctionCalling() {
    console.log("🤖 Gemini AI with MCP Tool Function Calling");
    console.log("==========================================\n");
    try {
        // Demo with some example queries
        const demoQueries = [
            "What are the latest AI research papers in 2025?",
            "Find some good coffee shops in San Francisco",
            "Tell me about the history of quantum computing",
        ];
        for (const [i, query] of demoQueries.entries()) {
            console.log(`\n🔄 DEMO #${i + 1}`);
            const answer = await processQuery(query);
            console.log("\n🤖 Gemini response:");
            console.log("=".repeat(50));
            console.log(answer);
            console.log("=".repeat(50));
            if (i < demoQueries.length - 1) {
                // Pause between demos
                console.log("\nMoving to next demo in a moment...");
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }
    }
    catch (error) {
        console.error("\n❌ Error:", error);
    }
    finally {
        // Clean up
        await transport.close();
        console.log("\n👋 Session ended");
    }
}
