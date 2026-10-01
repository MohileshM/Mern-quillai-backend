import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models.js';
import { protect } from '../middleware.js';

const r = Router();
const sign = u => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const pub = u => ({ id: u._id, name: u.name, email: u.email, credits: u.credits });

r.post('/register', async (req, res) => {
  const { name, password } = req.body;
  const email = req.body.email?.toLowerCase().trim();
  if (!name?.trim() || !email || !password || password.length < 6)
    return res.status(400).json({ message: 'Enter your name, an email and a password of at least 6 characters.' });
  if (await User.findOne({ email })) return res.status(409).json({ message: 'That email is already registered. Try signing in.' });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ token: sign(user), user: pub(user) });
});

r.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email?.toLowerCase().trim() });
  if (!user || !(await bcrypt.compare(req.body.password || '', user.password)))
    return res.status(401).json({ message: 'Email or password is incorrect.' });
  res.json({ token: sign(user), user: pub(user) });
});

r.get('/me', protect, (req, res) => res.json({ user: pub(req.user) }));

export default r;
