# Contributing to Google Drive MCP

Thank you for your interest in contributing! This project implements a Model Context Protocol (MCP) server for Google Drive, enabling AI assistants to interact with Drive files through RAG.

## Getting Started

1. Fork this repository
2. Clone your fork: `git clone https://github.com/<your-username>/google-drive-mcp.git`
3. Install dependencies:
   ```bash
   cd backend-new && npm install
   cd ../frontend && npm install
   ```
4. Create a `.env` file with your Google OAuth credentials (see README)
5. Run the development server: `npm run dev`

## How to Contribute

### Reporting Bugs
- Use the [Bug Report](https://github.com/sohamkatdare/google-drive-mcp/issues/new?template=bug_report.md) issue template
- Include steps to reproduce, expected vs actual behavior

### Suggesting Features
- Use the [Feature Request](https://github.com/sohamkatdare/google-drive-mcp/issues/new?template=feature_request.md) template
- Describe the use case and proposed solution

### Pull Requests
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes with clear commit messages
3. Ensure TypeScript compiles cleanly: `npm run build`
4. Submit a PR with a description of changes

## Code Style
- TypeScript strict mode
- Use async/await over raw promises
- Document public functions with JSDoc comments

## Areas for Contribution
- [ ] Additional MCP tools (Sheets, Docs, Slides support)
- [ ] Improved chunking strategies for large documents
- [ ] Caching layer for frequently accessed files
- [ ] Unit and integration tests
- [ ] Docker containerization

## License
By contributing, you agree that your contributions will be licensed under the MIT License.
