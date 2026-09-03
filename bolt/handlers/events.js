const events = (boltApp) => {
  // When a user joins the team, send a message in a predefined channel asking them to introduce themselves
  boltApp.event("member_joined_channel", async ({ event, client, logger }) => {
    try {
      logger.info("event info", event);
      const result = await client.chat.postMessage({
        channel: event.channel,
        text: `Welcome to the team, <@${event.user}>! 🎉 You can introduce yourself in this channel.`,
      });
      logger.info("event result", result);
    } catch (error) {
      logger.error(error);
    }
  });
};

module.exports = events;