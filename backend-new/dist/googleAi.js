import { GoogleGenerativeAI } from "@google/generative-ai";
import { Readable } from "node:stream";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import 'dotenv/config'
export const googleGenAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
export function bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); // Signal the end of the stream
    return stream;
}
/**
 * Creates an MCP client connected to the Brave Search server
 */
export async function createMcpClient() {
    const transport = new StdioClientTransport({
        command: "node",
        args: ["dist/server.js"], // Server entry point
    });
    const client = new Client({ name: "gemini-mcp-client", version: "1.0.0" }, { capabilities: { tools: {} } });
    await client.connect(transport);
    return { client, transport };
}
