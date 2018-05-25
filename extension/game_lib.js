'use strict';

const rounds = 7;

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

const possibleHands = ['rock', 'paper', 'scissors'];

const player_hand = ({ player, data, hands, nodecg }) => {
  if (!possibleHands.includes(data)) {
    console.error(`Got bad hand? "${data}"`);
    return;
  }

  let { p1, p2 } = hands.value;
  if (player === 1) {
    p1 = data;
    nodecg.sendMessage('player1_hand_anim', data);
  } else if (player === 2) {
    p2 = data;
    nodecg.sendMessage('player2_hand_anim', data);
  } else {
    console.error(`Got bad player? "${player}"`);
    return;
  }

  console.log(`Player ${player} hand: "${data}"`);
  hands.value = { p1, p2 };
};

const winCalc = {
  'rock_rock': null,
  'rock_paper': 2,
  'rock_scissors': 1,

  'paper_rock': 1,
  'paper_paper': null,
  'paper_scissors': 2,

  'scissors_rock': 2,
  'scissors_paper': 1,
  'scissors_scissors': null,
}

const finalize = ({ hands, game }) => {
  const { p1, p2 } = hands.value;
  if (!p1 || !p2) {
    console.log("Can't finalize without two good hands:", hands.value);
    return;
  }

  const winner = winCalc[`${p1}_${p2}`];
  if (typeof winner === 'undefined') {
    console.error("Can't calculate winner! hands:", hands.value);

  } else if (winner === null) {
    console.log(hands.value, "tie!");

  } else if (winner === 1) {
    console.log(hands.value, "Player one wins!");
    set_round_win({ data: 1, game });
    hands.value = { p1: null, p2: null };

  } else if (winner === 2) {
    console.log(hands.value, "Player two wins!");
    set_round_win({ data: 2, game });
    hands.value = { p1: null, p2: null };

  } else {
    // not supposed to happen:
    console.error("This makes no sense, can't calculate winner! hands:", hands.value);
  }

};

module.exports = {
  finalize,
  player_hand,
  reset_game,
  set_round_win,
};
