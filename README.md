# Google Drive RAG/MCP System

This project is a Retrieval-Augmented Generation (RAG) system and Model Context Protocol (MCP) server for Google Drive, with a modern Next.js frontend and a Node.js/Express backend. It enables intelligent search, retrieval, and chat over your Google Drive files, supporting Google Docs, Sheets, and more.

---

## Project Structure

```
thirdlayerassessment/
├── backend-new/      # Node.js/Express MCP server for Google Drive
│   ├── index.js      # Main backend entrypoint
│   ├── server.ts     # TypeScript server logic
│   ├── ...           # Other backend logic and utilities
│   └── package.json  # Backend dependencies and scripts
├── frontend/         # Next.js React frontend
│   ├── src/          # Frontend source code
│   ├── package.json  # Frontend dependencies and scripts
│   └── ...           # Other frontend files
├── run-dev.sh        # Script to run both frontend and backend together
└── README.md         # This file
```

---

## Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- Google Cloud project with OAuth credentials for Drive API (see backend README for details)

---

## Quick Start

1. **Clone the repository and set up credentials**
   - Place your Google OAuth credentials in the backend-new directory as required by the backend README.

2. **Run both frontend and backend**

```bash
chmod +x run-dev.sh
./run-dev.sh
```

- The backend will start on [http://localhost:3001](http://localhost:3001)
- The frontend will start on [http://localhost:3000](http://localhost:3000)

---

## Frontend (Next.js)
- Located in the `frontend/` directory
- Run with `npm run dev` (or use the script above)
- Main entry: `src/app/page.tsx`
- Talks to backend at `/chat/` and authentication endpoints

## Backend (Node.js/Express)
- Located in the `backend-new/` directory
- Main entry: `index.js`
- Run with `node index.js` (or use the script above)
- Handles Google Drive authentication, file search, and chat endpoints
- See `backend-new/README.md` for API details and advanced usage

---

## Authentication
- On first run, visit the backend's `/authenticate` endpoint to complete Google OAuth
- Tokens are stored locally for subsequent runs

---

## Development
- Edit frontend code in `frontend/src/`
- Edit backend code in `backend-new/`
- Both support hot reload (Next.js and nodemon/tsc --watch)

---

## Example API Usage
- `POST /chat/?query=your+question` — Chat with your Drive context
- `GET /authenticate` — Start Google OAuth flow

---

## Troubleshooting
- Ensure both ports 3000 (frontend) and 3001 (backend) are free
- Check backend logs for Google API errors
- See backend-new/README.md for more details

---

## License
MIT
