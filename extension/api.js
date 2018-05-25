const express = require('express');
const app = express();

const { finalize, player_hand, reset_game, set_round_win } = require('./game_lib');

const ns = 'nodecg-ccrew-rps';

module.exports = function (nodecg) {
  const game = nodecg.Replicant('rps_game', { defaultValue: [] });
  const hands = nodecg.Replicant('rps_hands', { defaultValue: { p1: null, p2: null } });

  app.get(`/${ns}/api/reset_game`, (req, res) => {
    reset_game({ game });
    res.send('OK!');
  });

  app.get(`/${ns}/api/set_round_win`, (req, res) => {
    const { data } = req.query;
    set_round_win({ data, game });
    res.send('OK!');
  });

  app.get(`/${ns}/api/player1_hand`, (req, res) => {
    const { data } = req.query;
    player_hand({ player: 1, data, hands, nodecg });
    res.send('OK!');
  });

  app.get(`/${ns}/api/player2_hand`, (req, res) => {
    const { data } = req.query;
    player_hand({ player: 2, data, hands, nodecg });
    res.send('OK!');
  });

  app.get(`/${ns}/api/finalize`, (req, res) => {
    finalize({ hands, game, nodecg });
    res.send('OK!');
  });

  nodecg.mount(app);
};
