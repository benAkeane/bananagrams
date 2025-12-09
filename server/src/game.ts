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

    // TODO: Implement playWord, peel, dump, getPublicState
    playWord(playerId: string, word: string): PlayResult {
        const player = this.players[playerId];
        if (!player) return { success: false, reason: 'player_not_found' };
        // finish
    }
}