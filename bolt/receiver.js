const { ExpressReceiver } = require('@slack/bolt');

const receiver = (expressApp) => {
  return new ExpressReceiver({
    app: expressApp,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    endpoints: {
      events: '/slack/events',
    },
  });
};

module.exports = receiver;