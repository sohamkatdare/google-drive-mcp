import { SchemaType } from "@google/generative-ai";
import { googleGenAi, createMcpClient } from "./googleAi.js";

const { client, transport } = await createMcpClient();

// Get available search tools
const { tools } = await client.listTools();
console.log(`Available tools: ${tools.map((t) => t.name).join(", ")}`);

// Configure function calling for Gemini
const model = googleGenAi.getGenerativeModel({
model: "gemini-2.0-pro-exp-02-05",
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
      description:
        "Search for files specifically in your Google Drive account (don't use exa nor brave to search for files)",
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
});

// Handle function calling with MCP
async function handleFunctionCall(functionCall: any) {
const { name, args } = functionCall;

console.log(`🔍 Gemini requested tool: ${name}`);
console.log(`📝 Function arguments: ${JSON.stringify(args)}`);

// Call the appropriate MCP tool
const result = await client.callTool({
name,
arguments: args,
});

return (result as any).content[0].text;
}

// Process user queries with Gemini and MCP tools
export async function processQuery(userQuery: string) {
  console.log(`\n📝 User query: "${userQuery}"`);

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userQuery }] }],
    });

    const response = result.response;

    // Check if Gemini wants to call a function
    if (
      response.candidates &&
      response.candidates[0].content.parts[0].functionCall
    ) {
      const functionCall =
        response.candidates[0].content.parts[0].functionCall;
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
  } catch (error) {
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message: string }).message
        : String(error);
    console.error(`Error processing query: ${errorMessage}`);
    return `Sorry, I encountered an error while processing your request: ${
      errorMessage || "Unknown error"
    }`;
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
  } catch (error) {
    console.error("\n❌ Error:", error);
  } finally {
    // Clean up
    await transport.close();
    console.log("\n👋 Session ended");
  }
}