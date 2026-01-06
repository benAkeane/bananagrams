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

}

test();