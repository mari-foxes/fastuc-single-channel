let enabled = false;

module.exports = {
  name: 'autophone',
  description: `autophone automatically calls if a call is hung up. \nIs enabled?: ${enabled}`,
  enabled: () => enabled,

  execute(message, args) {
    enabled = !enabled;
    message.channel.send(`autophone is now ${enabled ? 'enabled' : 'disabled'}.`);
  }
};