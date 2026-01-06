import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Game from './models/game.js';

const game = new Game();
const JWT_SECRET = process.env.JWT_SECRET!;

export const registerSocketHandlers = (io: Server) => {
    // authenticate sockets with JWT
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error('Unauthorized'));
        }

        try {
            const payload = jwt.verify(token, JWT_SECRET) as any;
            socket.data.userId = payload.userId;
            socket.data.email = payload.email;
            next();
        } catch {
            next(new Error('Unauthorized'));
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log('Client connected', socket.id);

        // listen for the client to join with a name
        socket.on('join', (name: string) => {
            const userId = socket.data.userId;
            game.addPlayer(userId, name);

            // send public state to all clients
            io.emit('state', game.getPublicState()); 

            // send private state to the player
            socket.emit('privateState', game.getPrivateState(userId));
        });

        // peel event (draws 1 tile for all players)
        socket.on('peel', () => {
            game.peel();
            io.emit('state', game.getPublicState());

            for (const pid in game.players) {
                const playerSocket = Array.from(io.sockets.sockets.values()).find(s => s.data.userId === pid);
                if (playerSocket) {
                    playerSocket.emit('privateState', game.getPrivateState(pid));
                }
            }
        });

        // play tiles event
        socket.on('playTiles', async ({ placements }: { placements: { letter: string, x: number, y: number }[] }) => {
            const userId = socket.data.userId;

            try {
                const result = await game.playTiles(userId, placements);
                // send result back to the player
                socket.emit('playResult', result);

                // send updated public state
                io.emit('state', game.getPublicState());

                // send updated private state to all players
                for (const pid in game.players) {
                    const playerSocket = Array.from(io.sockets.sockets.values()).find(s => s.data.userId === pid);
                    if (playerSocket) {
                        playerSocket.emit('privateState', game.getPrivateState(pid));
                    }
                }
            } catch (err) {
                console.error(err);
                socket.emit('playResult', { success: false, reason: 'server_error' });
            }
        });

        // dump tiles event
        socket.on('dump', ({ letter }: { letter: string }) => {
            const userId = socket.data.userId;

            try {
                const result = game.dump(socket.id, letter);

                socket.emit('dumpResult', result);

                // update public and private states
                io.emit('state', game.getPublicState());
                const playerSocket = Array.from(io.sockets.sockets.values()).find(s => s.data.userId === userId);
                if (playerSocket) {
                    playerSocket.emit('privateState', game.getPrivateState(userId));
                }
            } catch (err) {
                console.error(err);
                socket.emit('dumpResult', { success: false, reason: 'server_error' });
            }
        });

        // disconnect
        socket.on('disconnect', () => {
            console.log('Client Disconnected', socket.id);
            const userId = socket.data.userId;
            game.removePlayer(userId);
            io.emit('state', game.getPublicState());
        });
    });
};