const { App } = require('@slack/bolt');
const receiver = require("./receiver");
const handlers = require("./handlers");

const config = (expressApp) => {
  const boltApp = new App({
    receiver: receiver(expressApp),
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
  });

  handlers(boltApp);
};

module.exports = { config };