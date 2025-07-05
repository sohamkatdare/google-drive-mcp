#!/bin/bash

# Start the backend
cd backend-new
npm install
echo "Starting backend (node index.js)..."
npm run build
node index.js &
BACKEND_PID=$!
cd ..

# Start the frontend
cd frontend
npm install
echo "Starting frontend (npm run dev)..."
npm run dev &
FRONTEND_PID=$!

# Wait for both to exit
wait $BACKEND_PID
wait $FRONTEND_PID
