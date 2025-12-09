import TilePool from './tilePool';
import Player from './player';
import dictionary from './dictionary';

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

    playWord(playerId: string, word: string): PlayResult {
        const player = this.players[playerId];
        if (!player) return { success: false, reason: 'player_not_found' };
        
        const word_upper = word.toUpperCase();

        // check if word is in dictionary
        if (!dictionary.has(word_upper)) {
            return { success: false, reason: 'invalid_word' };
        }

        // count needed tiles for a word
        const needed: Record<string, number> = {};
        for (const character of word_upper) {
            needed[character] = (needed[character] || 0) + 1;
        }

        // count players rack tiles
        const rackCount: Record<string, number> = {};
        for (const tile of player.rack) {
            rackCount[tile] = (rackCount[tile] || 0) + 1;
        }


        // make sure player has enough tiles
        for (const character in needed) {
            if ((rackCount[character] || 0) < needed[character]) {
                return { success: false, reason: 'not_enough_tiles' };
            }
        }

        // remove tiles from players rack
        for (const character of word_upper) {
            const index = player.rack.indexOf(character);
            if (index !== -1) {
                player.rack.splice(index, 1);
            }
        }

        // TODO: draw 1 tile (peel)

        return { success: true }
    }

    // all players draw 1 tile
    peel(): void {
        for (const pid in this.players) {
            const player = this.players[pid];
            const tile = this.pool.draw(1);
            if (tile.length > 0) {
                player.addTiles(tile);
            }
        }
    }

    // exchange 1 tile for 3 new tiles
    dump(playerId: string, letter: string): PlayResult {
        const player = this.players[playerId];
        if (!player) return { success: false, reason: 'player_not_found' };

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
}