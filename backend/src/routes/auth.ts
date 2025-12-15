import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

interface SignupBody {
    username: string;
    email: string;
    password: string;
}

interface LoginBody {
    email: string;
    password: string;
}

// Sign up
router.post("/signup", async(req: Request<{}, {}, SignupBody>, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
            [username, email, hashedPassword]
        );

        const userId = result.rows[0].id;

        const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ userId, token });
    } catch (err: any) {
        console.error(err);
        if (err.code === '23505') {
            res.status(400).json({ error: 'Username or email already exists' });
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
});

// Login
router.post('/login', async(req: Request<{}, {}, LoginBody>, res: Response) => {
    const { email, password } = req.body;
    try {
       const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        ); 

        const user = result.rows[0];
        if (!user) {
            return res.status(401).json ({ error: 'Invalid email or password' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ userId: user.id, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;