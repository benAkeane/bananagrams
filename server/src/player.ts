export default class Player {
    id: string;
    name: string;
    rack: string[];

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.rack = [];
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
}