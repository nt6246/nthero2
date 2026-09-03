const { ExpressReceiver } = require('@slack/bolt')

const receiver = (expressApp) => {
  return new ExpressReceiver({
    app: expressApp
  });
};

module.exports = receiver;