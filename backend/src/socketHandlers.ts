import { Server, Socket } from 'socket.io';
import Game from './models/game.js';

const game = new Game();

export const registerSocketHandlers = (io: Server) => {
    io.on('connection', (socket: Socket) => {
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
            try {
                const result = await game.playWord(socket.id, word);
                // send the result to the player who played the word
                socket.emit('playResult', result);
                io.emit('state', game.getPublicState());
            } catch (err) {
                console.error(err);
                socket.emit('playResult', { success: false, reason: 'server_error' });
            }
        });

        // dump tiles event
        socket.on('dump', ({ letter }: { letter: string }) => {
            try {
                const result = game.dump(socket.id, letter);
                socket.emit('dumpResult', result);
                io.emit('state', game.getPublicState());
            } catch (err) {
                console.error(err);
                socket.emit('dumpResult', { success: false, reason: 'server_error' });
            }
        });

        // disconnect
        socket.on('disconnect', () => {
            console.log('Client Disconnected', socket.id);
            game.removePlayer(socket.id);
            io.emit('state', game.getPublicState());
        });
    });
};