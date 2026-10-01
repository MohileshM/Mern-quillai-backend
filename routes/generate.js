import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { Generation, User } from '../models.js';
import { protect } from '../middleware.js';

const r = Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const TEMPLATES = {
  blog: 'You are an expert blog writer. Write a well-structured, engaging post with a title, an intro, clear sections and a conclusion. Use plain text with short headings, no Markdown symbols.',
  email: 'You write clear, persuasive professional emails. Start with a subject line, then the email body.',
  social: 'You write scroll-stopping social media posts. Give 3 variations, each with a strong hook and relevant hashtags.',
  product: 'You write compelling product descriptions that lead with benefits, then features, and end with a call to action.',
  ad: 'You write high-converting ad copy. Give 3 headlines and 3 short body variants.',
};

r.use(protect);

// Streams the generation to the client as Server-Sent Events.
r.post('/stream', async (req, res) => {
  const { template, prompt, tone = 'Professional' } = req.body;
  if (!TEMPLATES[template] || !prompt?.trim())
    return res.status(400).json({ message: 'Choose a content type and describe what you need.' });

  // Atomically take one credit; refuse when none are left.
  const user = await User.findOneAndUpdate({ _id: req.user._id, credits: { $gt: 0 } }, { $inc: { credits: -1 } }, { new: true });
  if (!user) return res.status(402).json({ message: 'You have no credits left.' });

  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
  res.flushHeaders();
  const send = d => res.write(`data: ${JSON.stringify(d)}\n\n`);

  let output = '';
  try {
    console.log('Using model:', process.env.GEMINI_MODEL || 'gemini-3.6-flash');
    const stream = await ai.models.generateContentStream({
    model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      contents: prompt,
      config: { systemInstruction: `${TEMPLATES[template]} Write in a ${tone.toLowerCase()} tone.` },
    });
    for await (const chunk of stream) {
      if (chunk.text) { output += chunk.text; send({ text: chunk.text }); }
    }
    const generation = await Generation.create({ user: user._id, template, prompt, tone, output });
    send({ done: true, credits: user.credits, generation });
  } catch (e) {
    console.error(e);
    await User.updateOne({ _id: user._id }, { $inc: { credits: 1 } });
    send({ error: 'The draft could not be generated, and your credit was refunded. Try again in a moment.' });
  }
  res.end();
});

r.get('/history', async (req, res) => res.json(await Generation.find({ user: req.user._id }).sort('-createdAt').limit(50)));

r.delete('/:id', async (req, res) => {
  await Generation.deleteOne({ _id: req.params.id, user: req.user._id });
  res.json({ ok: true });
});

export default r;
