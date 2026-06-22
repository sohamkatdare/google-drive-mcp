# Google Drive MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/sohamkatdare/google-drive-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/sohamkatdare/google-drive-mcp/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![MCP](https://img.shields.io/badge/MCP-compatible-blue)](https://modelcontextprotocol.io)

> A Model Context Protocol (MCP) server that enables AI assistants to search, read, and interact with your Google Drive files using RAG (Retrieval-Augmented Generation).

## Features

- 🔍 **Semantic search** across Google Drive files
- 📄 **Document parsing** — Docs, Sheets, PDFs, and plain text
- 🤖 **MCP-compatible** — Works with Claude Desktop, Cursor, and any MCP client
- ⚡ **RAG pipeline** — Chunking + embeddings for accurate retrieval
- 🔐 **OAuth 2.0** — Secure Google authentication

## Quick Start

```bash
# Clone the repository
git clone https://github.com/sohamkatdare/google-drive-mcp.git
cd google-drive-mcp

# Install backend dependencies
cd backend-new && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Configure environment
cp .env.example .env
# Add your Google OAuth client ID and secret to .env

# Start the server
npm run dev
```

## MCP Client Configuration

Add to your MCP client config (e.g., `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "node",
      "args": ["path/to/google-drive-mcp/backend-new/index.js"]
    }
  }
}
```

## Project Structure

```
google-drive-mcp/
├── backend-new/      # Node.js/Express MCP server
│   ├── index.js      # Main entrypoint
│   ├── server.ts     # TypeScript MCP server logic
│   └── package.json
├── frontend/         # Next.js React frontend
│   └── src/
├── .github/          # CI/CD and issue templates
└── LICENSE
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Areas for Contribution
- Additional Google Workspace integrations (Sheets, Slides)
- Improved document chunking strategies
- Caching layer for frequently accessed files
- Test coverage

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
