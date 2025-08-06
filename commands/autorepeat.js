let enabled = false;

module.exports = {
  name: 'autorepeat',
  description: `autorepeat waits until the end of cooldown, and repeats the last command.\nIs enabled?: ${enabled}`,
  enabled: () => enabled,

  execute(message, args) {
    enabled = !enabled;
    message.channel.send(`Autorepeat is now ${enabled ? 'enabled' : 'disabled'}.`);
  }
};