type Board = Record<string, string>; // {"x,y": "Letter"}

export default class Player {
    id: string;
    name: string;
    rack: string[];
    board: Board; // players placed tiles

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.rack = [];
        this.board = {};
    }

    addTiles(tiles: string[]) {
        this.rack.push(...tiles.map((t) => t.toUpperCase()));
    }

    removeTiles(tiles: string[]): boolean {
        const tempRack = [...this.rack];

        for (const tile of tiles) {
            const index = tempRack.indexOf(tile.toUpperCase());
            if (index === -1) {
                return false;
            }
            tempRack.splice(index, 1);
        }

        this.rack = tempRack;
        return true;
    }

    hasTile(tile: string): boolean {
        return this.rack.includes(tile.toUpperCase());
    }

    hasTiles(tiles: string[]): boolean {
        const rackCopy = [...this.rack];
        for (const tile of tiles) {
            const index = rackCopy.indexOf(tile.toUpperCase());
            if (index === -1) {
                return false; 
            } 
            rackCopy.splice(index, 1);
        }
        return true;
    }

    placeTiles(placements: { letter: string; x: number; y: number }[]): void {
        for (const { letter, x, y } of placements) {
            const key = `${x},${y}`;
            this.board[key] = letter.toUpperCase();
        }
    }

    removeBoardTiles(placements: { x: number; y: number }[]): void {
        for (const { x, y } of placements) {
            const key = `${x},${y}`;
            delete this.board[key];
        }
    }

    // get public view of the player (for other players)
    getPublicState() {
        return {
            id: this.id,
            name: this.name,
            rackSize: this.rack.length,
        };
    }

    // get private view of the player (for the player themself)
    getPrivateState() {
        return {
            id: this.id,
            name: this.name,
            rack: [...this.rack],
            board: { ...this.board },
        };
    }
}