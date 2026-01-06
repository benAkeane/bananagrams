/**
 * TODO: 
 * Enforce first move in the center of the board
 * Integrate with socket events (playTiles)
 * Send placement payload to the frontend. {letter, x, y}
 */

import TilePool from './tilepool.js';
import Player from './player.js';
import { isWordValid } from '../services/dictionary.js';

export type PublicPlayer = {
    id: string;
    name: string;
    rackSize: number;
};

export type PlayResult = {
    success: boolean;
    reason?: string;
};

export default class Game {
    pool: TilePool;
    players: Record<string, Player>;

    constructor() {
        this.pool = new TilePool();
        this.players = {};
    }

    addPlayer(id: string, name: string) {
        if (this.players[id]) return;
        const player = new Player(id, name);
        player.addTiles(this.pool.draw(this.getStartingTilesCount()));
        this.players[id] = player;
    }

    removePlayer(id: string) {
        delete this.players[id];
    }

    getStartingTilesCount(): number {
        const count = Object.keys(this.players).length;
        // 2-4 players: 14 tiles, 5+: 10
        return count <= 4 ? 14 : 10;
    }

    async playTiles(playerId: string, placements: { letter: string; x: number; y: number }[]): Promise<PlayResult> {
        const player = this.players[playerId];
        if (!player) {
            return { success: false, reason: 'player_not_found' };
        }

        if (placements.length === 0) {
            return { success: false, reason: 'no_tiles_placed' };
        }
        
        // normalize letters
        const letters = placements.map(p => p.letter.toUpperCase());

        // check if player has all tiles
        if (!player.hasTiles(letters)) {
            return { success: false, reason: 'not_enough_tiles' };
        }

        // TODO: adjacency and board rules

        // assume placements are in valid positions for now
        player.placeTiles(placements);

        // extract all words formed (horizontal and vertical lines)
        const words = this.extractWords(player, placements);
        if (words.length === 0) {
            // rollback players tiles
            player.removeBoardTiles(placements);
            return { success: false, reason: 'no_valid_words_formed' };
        }

        // validate all words via dictionary
        for (const word of words) {
            const valid = await isWordValid(word);
            if (!valid) {
                player.removeBoardTiles(placements);
                return { success: false, reason: `invalid_word: ${word}` };
            }
        }

        // commit move (remove tiles from rack)
        if (!player.removeTiles(letters)) {
            player.removeBoardTiles(placements);
            return { success: false, reason: 'rack_mismatch' };
        }

        this.peel();

        return { success: true }
    }

    // TODO: add logic for adjacency rules and overlapping tiles
    extractWords(player: Player, placements: { x: number, y: number }[]): string[] {
        const board = player.board;
        const words: string[] = [];
        const positions = placements.map(p => `${p.x},${p.y}`);

        // check horizontal and vertical word for each tile placed
        for (const pos of positions) {
            const [x, y] = pos.split(',').map(Number);

            // horizontal
            let hWord = '';
            let hx = x;
            while (board[`${hx},${y}`]) {
                hWord += board[`${hx},${y}`];
                hx++;
            }
            if (hWord.length > 1) words.push(hWord);

            // vertical
            let vWord = '';
            let vy = y;
            while (board[`${x},${vy}`]) vy--;
            vy++;
            while (board[`${x},${vy}`]) {
                vWord += board[`${x},${vy}`];
                vy++;
            }
            if (vWord.length > 1) words.push(vWord);
        }

        // remove duplicates
        return Array.from(new Set(words));
    }


    // all players draw 1 tile
    peel(): void {
        for (const pid in this.players) {
            const player = this.players[pid];
            const tile = this.pool.draw(1);
            if (tile.length > 0) {
                player!.addTiles(tile);
            }
        }
    }

    // exchange 1 tile for 3 new tiles
    dump(playerId: string, letter: string): PlayResult {
        const player = this.players[playerId];
        if (!player) {
            return { success: false, reason: 'player_not_found' };
        }

        const letter_upper = letter.toUpperCase();
        const index = player.rack.indexOf(letter_upper);

        if (index === -1) {
            return { success: false, reason: 'tile_not_in_rack' }
        }

        player.rack.splice(index, 1);

        this.pool.return([letter_upper]);

        const newTiles = this.pool.draw(3);
        player.addTiles(newTiles);

        return { success: true };
    }

    // public state sent to all clients
    getPublicState() {
        return {
            players: Object.values(this.players).map((p) => ({
                id: p.id,
                name: p.name,
                rackSize: p.rack.length,
            })),
            poolSize: this.pool.tilesRemaining(),
        };
    }

    getPrivateState(playerId: string) {
        const player = this.players[playerId];
        if (!player) {
            return null;
        }
        return player.getPrivateState();
    }
}