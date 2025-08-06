let enabled = true;

module.exports = {
  name: 'autoresponse',
  description: `autoresponse automatically responds to certain messages based on predefined keywords.\nIs enabled?: ${enabled}`,
  enabled: () => enabled,

  execute(message, args) {
    enabled = !enabled;
    message.channel.send(`Autoresponse is now ${enabled ? 'enabled' : 'disabled'}.`);
  }
};