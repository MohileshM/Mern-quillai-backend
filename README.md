# QuillAI backend

Express + MongoDB (Mongoose) API with JWT auth and Gemini streaming over Server-Sent Events.

## Run locally
```bash
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm run dev
```

## Push to GitHub
```bash
git init && git add . && git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/quillai-backend.git
git push -u origin main
```

## Deploy on Render
1. MongoDB Atlas: create a free cluster, a database user, and allow `0.0.0.0/0` under Network Access.
2. Render: **New > Web Service**, connect the `quillai-backend` repo.
3. Build command `npm install`, start command `npm start`.
4. Add environment variables from `.env.example` (`CLIENT_URL` = your Netlify URL, no trailing slash).
5. Copy the Render URL (for example `https://quillai-backend.onrender.com`) into the frontend's `VITE_API_URL`.

API: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/generate/stream`, `GET /api/generate/history`, `DELETE /api/generate/:id`.
