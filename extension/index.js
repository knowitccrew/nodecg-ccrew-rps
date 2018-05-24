'use strict';

module.exports = function (nodecg) {
  nodecg.listenFor('setp1', (data) => {
    console.log(`Got setp1: "${data}"`);
  });

  nodecg.listenFor('setp2', (data) => {
    console.log(`Got setp2: "${data}"`);
  });

  nodecg.listenFor('finalize', (data) => {
    console.log(`Got finalize: "${data}"`);
  });

};
