# Geopolitics Dashboard Setup

The Geopolitics Dashboard is a full-stack MERN application that fetches live global news via RSS, maps it to real-world coordinates, and broadcasts the updates in real-time to a React-powered 3D globe visualization.

## Backend Startup
1. Make sure you are in the `backend` directory.
2. Create a `.env` file and add your MongoDB Atlas string under `MONGO_URI`. If not set, it defaults to `mongodb://localhost:27017/geopolitics`.
3. Start the Node server: `node server.js`

## Frontend Startup
1. Make sure you are in the `frontend` directory.
2. Start the Vite development server: `npm run dev`

The `LiveNews` documents have a 24-hour TTL (Time-To-Live) index, meaning MongoDB will aggressively delete old articles to conserve storage on your free tier cluster.
