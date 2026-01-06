import Game from '../models/game.js';

async function test() {
    const game = new Game();

    // add player
    game.addPlayer('player1', 'Ben');

    // give player a rack for testing
    game.players['player1']!.rack = ['A', 'P', 'P', 'L', 'E'];

    // test valid word placement: "APPLE" horizontally starting at (0,0)
    const placements1 = [
        { letter: 'A', x: 0, y: 0 },
        { letter: 'P', x: 1, y: 0 },
        { letter: 'P', x: 2, y: 0 },
        { letter: 'L', x: 3, y: 0 },
        { letter: 'E', x: 4, y: 0 },        
    ];
    const result1 = await game.playTiles('player1', placements1);
    console.log('Playing "Apple" at (0,0):', result1);
    console.log('Player board:', game.players['player1']!.board);
    console.log('Player rack:', game.players['player1']!.rack);

    // test invalid word: "ABCDEFG"
    game.players['player1']!.rack = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const placements2 = [
        { letter: 'A', x: 0, y: 1 },
        { letter: 'B', x: 1, y: 1 },
        { letter: 'C', x: 2, y: 1 },
        { letter: 'D', x: 3, y: 1 },
        { letter: 'E', x: 4, y: 1 }, 
        { letter: 'F', x: 5, y: 1 },
        { letter: 'G', x: 6, y: 1 }, 
    ];
    const result2 = await game.playTiles('player1', placements2);
    console.log('Playing invald word "ABCDEFG":', result2);

    // try to play a word without enough tiles
    const placements3 = [
        { letter: 'A', x: 0, y: 2 },
        { letter: 'P', x: 1, y: 2 }, 
        { letter: 'P', x: 2, y: 2 },
        { letter: 'L', x: 3, y: 2 }, 
        { letter: 'E', x: 4, y: 2 },
    ];
    const result3 = await game.playTiles('player1', placements3);
    console.log('Playing "APPLE" without enough tiles:', result3);

    // test peel (adds 1 tile to rack)
    game.peel();
    console.log('Player rack after peel:', game.players['player1']!.rack);

    // Test dump (removes given tile, replaces with three new tiles)
    const tileToDump = game.players['player1']!.rack[0]; // dump first tile
    const result5 = game.dump('player1', tileToDump);
    console.log(`Dumping tile "${tileToDump}":`, result5);
    console.log('Player rack after dump:', game.players['player1']!.rack);
}

test();