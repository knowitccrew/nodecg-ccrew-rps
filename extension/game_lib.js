'use strict';

const set_round_win = ({ data, game }) => {
  console.log(`Got set_round_win: "${data}"`);
  const newGame = game.value.slice();

  if (game.value.length >= rounds) {
    console.log(`Can't set win: Game is already full!`, game.value);

  } else if (data == 1) {
    newGame.push(1);
    game.value = newGame;

  } else if (data == 2) {
    newGame.push(2);
    game.value = newGame;

  } else {
    console.log(`Can't set win: Invalid value!`);
  }
};

const reset_game = ({ game }) => {
  console.log('Got reset_game');
  game.value = [];
};


module.exports = {
  set_round_win,
  reset_game,
};
