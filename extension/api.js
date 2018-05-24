const express = require('express');
const app = express();

const { reset_game } = require('./game_lib');

const ns = 'nodecg-ccrew-rps';

module.exports = function (nodecg) {
  const game = nodecg.Replicant('rps_game', { defaultValue: [] });

  app.get(`/${ns}/api/reset_game`, (req, res) => {
    reset_game({ game });
    res.send('OK!');
  });

  nodecg.mount(app);
};
