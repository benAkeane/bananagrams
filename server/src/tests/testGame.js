import Game from '../server/src/game.js';
import dotenv from 'dotenv';
dotenv.config();
async function test() {
    const game = new Game();
    game.addPlayer('player1', 'Ben');
    game.players['player1'].rack = ['P', 'A', 'P', 'E', 'L'];
    // test valid word
    const result1 = await game.playWord('player1', 'apple');
    console.log('Playering "apple":', result1);
    // test invalid word
    const result2 = await game.playWord('player1', 'dasjdnajsd');
    console.log('Playing "dasjdnajsd":', result2);
    // try to play a word without enough tiles
    const result3 = await game.playWord('player1', 'apple');
    console.log('Playing "apple":', result3);
    console.log('Player rack after plays:', game.players['player1'].rack);
}
test();
//# sourceMappingURL=testGame.js.map