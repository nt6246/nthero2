const events = require("./events");

const handlers = (boltApp) => {
  events(boltApp);
};

module.exports = handlers;