# QuillAI — Backend API
A high-performance Express and MongoDB API powering QuillAI. Featuring secure JWT authentication, history persistence, and real-time AI response generation powered by Google Gemini streamed directly over Server-Sent Events (SSE).

# Key Features
Real-Time AI Streaming: Uses Server-Sent Events (SSE) to stream Gemini-generated responses to the client instantly.

Authentication & Authorization: Role-based access control and session management via JSON Web Tokens (JWT) and bcrypt password hashing.

Prompt & History Management: Save, fetch, and purge user generation history directly in MongoDB.

Deployment-Ready Setup: Pre-configured for seamless hosting on platforms like Render and MongoDB Atlas with built-in CORS controls.

# Tech Stack
Runtime: Node.js

Framework: Express.js

Database: MongoDB with Mongoose ODM

AI Engine: Google Gemini API (@google/generative-ai)

Authentication: JSON Web Tokens (JWT) & bcrypt
