import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Game from './game.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const game = new Game();

io.on('connection', (socket) => {
    console.log('Client connected', socket.id);

    // listen for the client to join with a name
    socket.on('join', (name: string) => {
        game.addPlayer(socket.id, name);
        // send updated state to all clients
        io.emit('state', game.getPublicState()); 
    });

    // peel event (draws 1 tiel for all players)
    socket.on('peel', () => {
        game.peel();
        io.emit('state', game.getPublicState());
    });

    // play word event
    socket.on('playWord', async ({ word }: { word: string }) => {
        const result = await game.playWord(socket.id, word);
        // send the result to the player who played the word
        socket.emit('playResult', result);
        io.emit('state', game.getPublicState());
    });

    // dump tiles event
    socket.on('dump', ({ letter }: { letter: string }) => {
        const result = game.dump(socket.id, letter);
        socket.emit('dumpResult', result);
        io.emit('state', game.getPublicState());
    });

    // disconnect
    socket.on('disconnect', () => {
        console.log('Client Disconnected', socket.id);
        game.removePlayer(socket.id);
        io.emit('state', game.getPublicState());
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


