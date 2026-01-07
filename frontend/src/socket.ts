import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            autoConnect: false,
        });
    }
    return socket;
};

export const connectSocket = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return;
    }

    const s = getSocket();
    s.auth = {
        token
    };
    s.connect();
};

export const disconnectSocket = () => {
    socket?.disconnect();
};