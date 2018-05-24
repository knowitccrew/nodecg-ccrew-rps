'use strict';

const game = require('./game');
const api = require('./api');

module.exports = function (nodecg) {
  game(nodecg);
  api(nodecg);
};
