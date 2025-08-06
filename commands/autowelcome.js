let enabled = false;

module.exports = {
  name: 'autowelcome',
  description: `autowelcome automatically greets people when a call starts.\nIs enabled?: ${enabled}`,
  enabled: () => enabled,

  execute(message, args) {
    enabled = !enabled;
    message.channel.send(`Autowelcome is now ${enabled ? 'enabled' : 'disabled'}.`);
  }
};