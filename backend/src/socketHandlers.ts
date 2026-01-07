import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Game from './models/game.js';

const game = new Game();
const JWT_SECRET = process.env.JWT_SECRET!;

export const registerSocketHandlers = (io: Server) => {
    const getSocketByUserId = (uid: string) => {
        return Array.from(io.sockets.sockets.values()).find(s => s.data.userId === uid);
    };

    const updatePlayers = () => {
        io.emit('state', game.getPublicState());
        for (const pid in game.players) {
            const ps = getSocketByUserId(pid);
            if (ps) {
                ps.emit('privateState', game.getPrivateState(pid));
            }
        }
    };

    // commented out for ease of development 
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

        socket.data.userId = socket.id;

        // listen for the client to join with a name
        socket.on('join', (name: string) => {
            const userId = socket.data.userId;
            game.addPlayer(userId, name);
            socket.emit('privateState', game.getPrivateState(userId));
            updatePlayers();
        });

        // peel event (draws 1 tile for all players)
        socket.on('peel', () => {
            game.peel();
            updatePlayers();
        });

        // play tiles event
        socket.on('playTiles', async ({ placements }: { placements: { letter: string, x: number, y: number }[] }) => {
            const userId = socket.data.userId;
            try {
                const result = await game.playTiles(userId, placements);
                // send result back to the player
                socket.emit('playResult', result);
                updatePlayers();
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
                updatePlayers();
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
            updatePlayers();
        });
    });
};