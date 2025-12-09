export default class TilePool {
    tiles: string[];

    constructor() {
        this.tiles = [
            ...Array(9).fill('A'),
            ...Array(2).fill('B'),
            ...Array(2).fill('C'),
            ...Array(4).fill('D'),
            ...Array(12).fill('E'),
            ...Array(2).fill('F'),
            ...Array(3).fill('G'),
            ...Array(2).fill('H'),
            ...Array(9).fill('I'),
            ...Array(1).fill('J'),
            ...Array(1).fill('K'),
            ...Array(4).fill('L'),
            ...Array(2).fill('M'),
            ...Array(6).fill('N'),
            ...Array(8).fill('O'),
            ...Array(2).fill('P'),
            ...Array(1).fill('Q'),
            ...Array(6).fill('R'),
            ...Array(4).fill('S'),
            ...Array(6).fill('T'),
            ...Array(4).fill('U'),
            ...Array(2).fill('V'),
            ...Array(2).fill('W'),
            ...Array(1).fill('X'),
            ...Array(2).fill('Y'),
            ...Array(1).fill('Z')
        ];

        this.shuffle();
    }

    shuffle() {
        for (let i = this.tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tiles[i], this.tiles[j]] = [this.tiles[j]!, this.tiles[i]!]
        }
    }

    draw(n: number): string[] {
        return this.tiles.splice(0, n);
    }

    return(tiles: string[]) {
        this.tiles.push(...tiles.map((t) => t.toUpperCase()));
        this.shuffle();
    }

    tilesRemaining(): number {
        return this.tiles.length;
    }
}