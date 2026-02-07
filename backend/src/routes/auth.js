import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Watchlist from '../models/Watchlist.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const username = email.split('@')[0];
    
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
    });

    await Watchlist.create({
      user_id: user._id,
      title: 'Favorites',
      description: 'Your top-tier cinematic picks.',
      is_system_list: true
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, username: user.username, avatar_url: user.avatar_url } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, username: user.username, avatar_url: user.avatar_url } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
