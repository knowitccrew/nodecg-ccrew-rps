'use strict';

module.exports = function (nodecg) {

  const rounds = 7;
  const gamep1 = nodecg.Replicant('rps_game_p1', { defaultValue: [] });
  const gamep2 = nodecg.Replicant('rps_game_p2', { defaultValue: [] });

  const game = nodecg.Replicant('rps_game', { defaultValue: [] });

  const stringToValue = {
    'true': true,
    't': true,
    '1': true,
    1: true,
    'yes': true,

    'false': false,
    'f': false,
    '0': false,
    0: false,
    'no': false,
  };

  nodecg.listenFor('setp1', (data) => {
    const value = stringToValue[data && data.toLowerCase()];
    if (value != null) {
      console.log(`Got valid setp1: "${data}" (${value})`);
      if (gamep1.value.length < rounds) {
        gamep1.value.push(value);
      } else {
        console.log("ERROR: Game for player 1 is full!", gamep1.value.length, gamep1.value);
      }
    } else {
      console.log(`Got INVALID setp1: "${data}"`);
    }
  });

  nodecg.listenFor('setp2', (data) => {
    const value = stringToValue[data && data.toLowerCase()];
    if (value != null) {
      console.log(`Got valid setp2: "${data}" (${value})`);
      if (gamep2.value.length < rounds) {
        gamep2.value.push(value);
      } else {
        console.log("ERROR: Game for player 2 is full!", gamep2.value.length, gamep2.value);
      }
    } else {
      console.log(`Got INVALID setp2: "${data}"`);
    }
  });

  nodecg.listenFor('finalize', (data) => {
    console.log(`Got finalize: "${data}"`);
  });

  nodecg.listenFor('set_round_win', (data) => {
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
  });

  nodecg.listenFor('reset_game', (data) => {
    console.log(`Got reset_game: "${data}"`);
    game.value = [];
  });

};
