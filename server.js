import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import auth from './routes/auth.js';
import generate from './routes/generate.js';

const app = express();
app.use(cors({ origin: (process.env.CLIENT_URL || '').split(',').map(s => s.trim()) }));
app.use(express.json());
app.get('/', (_req, res) => res.json({ ok: true, service: 'quillai-api' }));
app.use('/api/auth', auth);
app.use('/api/generate', generate);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log('API running')))
  .catch(e => { console.error(e); process.exit(1); });
