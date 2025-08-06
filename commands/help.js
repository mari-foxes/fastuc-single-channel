module.exports = {
  name: 'help',
  execute(message, args) {
    message.channel.send('```fastuc-sc 0.0.1 written by mari-foxes```')

    let reply = '```yml\n';
    message.client.commands.forEach((cmd, name) => {
      reply += `- ${name}\n${cmd.description || 'No description'}\n\n`;
    });
    reply += '```';
    message.channel.send(reply);
  },
  description: 'help lists all available commands.'
};