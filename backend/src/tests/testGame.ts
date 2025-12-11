import Game from '../models/game.js';

async function test() {
    const game = new Game();

    game.addPlayer('player1', 'Ben');

    game.players['player1']!.rack = ['P', 'A', 'P', 'E', 'L'];

    // test valid word
    const result1 = await game.playWord('player1', 'apple');
    console.log('Playing "apple":', result1);

    // test invalid word
    const result2 = await game.playWord('player1', 'dasjdnajsd');
    console.log('Playing "dasjdnajsd":', result2);

    // try to play a word without enough tiles
    const result3 = await game.playWord('player1', 'apple');
    console.log('Playing "apple":', result3);

    // test peel (adds 1 tile to rack)
    const result4 = await game.peel();
    console.log('Player rack after peel:', game.players['player1']!.rack)

    // test dump after peel (removes peeled tile, replaces with three new tiles)
    const result5 = await game.dump('player1', game.players['player1']!.rack[0])
    console.log('Player rack after dump:', game.players['player1']!.rack);
}

test();