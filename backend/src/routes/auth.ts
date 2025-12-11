import { Router } from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js';

const router = Router();

// Sign up
router.post('/signup', async(req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
        [username, email, password]
    );

    res.json({ userId: result.rows[0].id });
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid email' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid password' });

    res.json({ userId: user.id });
});

export default router;
