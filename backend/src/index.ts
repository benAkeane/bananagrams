import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import { registerSocketHandlers } from './socketHandlers.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const FRONTEND_URL = 'http://localhost:3001';
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: { 
        origin: FRONTEND_URL,
        methods: ['GET', 'POST'],
        credentials: true, 
    } 
});

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}));

app.use(express.json());
app.use('/auth', authRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendBuildPath = path.join(__dirname, '../../frontend/build');
app.use(express.static(frontendBuildPath));

app.get(/^\/.*$/, (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

registerSocketHandlers(io);

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});