let enabled = false;
let regex = /^(?=.{6,256}$)[a-zA-Z_.-]+$/;

module.exports = {
  name: 'regexfilter',
  description: `regexfilter filters usernames based on a regex, and hangs up calls if the username does not match.\nIs enabled?: ${enabled}\nCurrent regex: \`${regex}\``,
  enabled: () => enabled,

  execute(message, args) {
    if (!args.length) {
      // Toggle enabled/disabled if no args
      enabled = !enabled;
      message.channel.send(`Username filter is now ${enabled ? 'enabled' : 'disabled'}.`);
      return;
    }

    // Combine args into a regex pattern string
    const regexString = args.join(' ');

    try {
      regex = new RegExp(regexString);
      message.channel.send(`Username filter regex set to: \`${regex}\``);
    } catch (error) {
      message.channel.send(`Invalid regex: \`${regexString}\``);
    }
  },

  // Optional method to be used elsewhere
  checkUsername(user) {
    if (!enabled || !regex) return false;
    return regex.test(user.username);
  }
};
