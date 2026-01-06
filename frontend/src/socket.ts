import { io, Socket } from 'socket.io-client';

const FRONTEND_URL = 'http://localhost:3001';
const token = localStorage.getItem('token');

export const socket: Socket = io('http://localhost:3000', {
    auth: { token },
    transports: ['websocket', 'polling'],
});