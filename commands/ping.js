module.exports = {
  name: 'ping',
  description: 'ping replies with pong!',
  execute(message, args) {
    message.channel.send('Pong!');
  }
};