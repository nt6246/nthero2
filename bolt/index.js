const { App } = require('@slack/bolt')

const config = (expressApp) => {
  const boltApp = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
  });
};

module.exports = { config };