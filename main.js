require('dotenv').config({ quiet: true });

const fs = require('fs');
const path = require('path');
const { Client } = require('discord.js-selfbot-v13');
const { figureItOut, cooldownQueue } = require('./figureItOutV2.js'); 
const logger  = require('./logger.js');

const client = new Client();
client.commands = new Map();

const prefix = '+';

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);

  logger.debug(`Loaded module: ${command.name}`);
}

client.on('ready', async () => {
  logger.warn(`Welcome to fastuc-single-channel release. This is a beta version, so expect bugs and issues.`);
  logger.warn(`https://github.com/mari-foxes/fastuc-single-channel`)
  logger.info(`Logged in as ${client.user.tag}`);
  setInterval(() => {
      const now = Date.now();
      for (const [interaction, expiresAt] of cooldownQueue.entries()) {
        if (now >= expiresAt) {
          logger.debug(`Cooldown expired for interaction: ${interaction}`);
          cooldownQueue.delete(interaction);
          if (client.lastInteraction) {
            const channel = client.channels.cache.get(process.env.allowed_channel_id);
            if (channel) {
                logger.debug(client.lastInteraction);
                channel.sendSlash(process.env.bot_id, client.lastInteraction).then(() => {
                    logger.debug(`Re-sent interaction: ${client.lastInteraction}`);
                }).catch(err => {
                    logger.error(`Failed to re-send interaction: ${client.lastInteraction}`, err);
                });
            }
          }
        }
      }
    }, 1000); 
});


client.on('messageUpdate', (before, after) => {
    if (
        !after.guild ||
        after.guild.id !== process.env.allowed_guild_id ||
        after.channel.id !== process.env.allowed_channel_id
    ) {
        return;
    }

    if (after) {
        client.lastInteraction = after.interaction && after.interaction.commandName ? after.interaction.commandName : null;
        figureItOut(after, client);
    }
});


client.on('messageCreate', async (message) => {
  if (
    !message.guild ||
    message.guild.id !== process.env.allowed_guild_id ||
    message.channel.id !== process.env.allowed_channel_id
  ) {
    return;
  }

  client.lastInteraction = message.interaction && message.interaction.commandName ? message.interaction.commandName : null;
  figureItOut(message, client);
  

  const autoresponse = client.commands.get('autoresponse');
  if (autoresponse && autoresponse.enabled && autoresponse.enabled()) {
    if (message.author.id !== client.user.id) {
        // todo handle autoresponse
    }
  }

  if (message.author.id == client.user.id) {
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (command) {
      command.execute(message, args);
    }
  }
});


client.login(process.env.token);