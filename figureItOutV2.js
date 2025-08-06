/*
    figureItOutV2.js
    aka the most fucking retarded code ever, prepare yourself for this cinematic masterpiece
*/

const logger = require('./logger.js');

const botMessages = {
    otherHangup:    ["/the other party hung up the userphone/","/the other side hung up the userphone/"],
    youHangup:      ["/you hung up the userphone/"],
    youOverload:    ["/you have caused an overload on the userphone connection/"],
    otherOverload:  ["/the userphone connection was severed due to an overload from the other party/"],
    botConnect:     ["/the other party has picked up the userphone/", "/a userphone connection has been made!/"],
    botSwitch:      ["/sounds like there's someone new on the userphone/"],
    botDisconnect:  ["/the userphone connection has been lost/","/hanging up the userphone./"],
    botCalling:     ["/calling on userphone/","/attempting to request a userphone connection/"],
    botInform:      ["/you haven't participated in this conversation/"],
    botShit:        ["/this server is too small to use this command/"],
    botAlready:     ["/a userphone call is already in progress/"],
    botNoHangup:    ["/there is currently no call to hang up!/"],
    botGetReady:    ["/a userphone connection will be started in 5 seconds. get ready!/"],
};

const compiledInteraction = Object.fromEntries(
    Object.entries(botMessages).flatMap(([key, regexStrs]) => 
        (Array.isArray(regexStrs) ? regexStrs : [regexStrs]).map((regexStr, i) => [`${key}${i}`, new RegExp(regexStr.slice(1, -1))])
    )
);

const cooldownRegex = /that command is on cooldown for \*\*(\d+)\*\* more seconds\./;
const userphoneRegex = /\*\*(.*?)\*\*\s<:userphone(?:_\w+)?:\d+>\s(.*)/

const type = {
    BOT: "bot",
    USER: "user",
}

const cooldownQueue = new Map();


function figureItOut(message, client) {
    const isBot = message.author.bot;
    const botID = message.author.id;
    const content = message.content;
    const contentLower = content.toLowerCase();
    
    const autowelcome = client.commands.get('autowelcome');
    const autorepeat = client.commands.get('autorepeat');
    const regexfilter = client.commands.get('regexfilter');
    const autophone = client.commands.get('autophone');

    // check if the message may match botMessage
    if (isBot && botID == process.env.bot_id) {
        // Strip asterisks for bot message checking
        const strippedContent = contentLower.replace(/\*/g, '');
        
        for (const [key, regex] of Object.entries(compiledInteraction)) {
            if (regex.test(strippedContent)) {
                logger.debug(`Obtained bot message: ${key}`);
                if (autophone && autophone.enabled && autophone.enabled()) {
                    if (key.startsWith('otherHangup') || key.startsWith('youHangup')) {
                        logger.debug("Autophone is enabled, new call!");
                        const channel = client.channels.cache.get(process.env.allowed_channel_id);
                        if (channel) {
                            channel.sendSlash(process.env.bot_id, "userphone").then(() => {
                                logger.debug("Sent userphone command after hangup.");
                            }).catch(err => {
                                logger.error("Failed to send userphone command after hangup", err);
                            });
                        }
                    }
                }

                if (autowelcome && autowelcome.enabled && autowelcome.enabled()) { 
                    if (key.startsWith('botConnect')) {
                        const welcomeMessage = `Hiya!!`; //todo: change this to a random welcome message from the database
                        message.channel.send(welcomeMessage);
                    }
                }
            }
        }
        
        // if it doesn't, let's check if it's a cooldown message
        if (cooldownRegex.test(contentLower)) {
            if (autorepeat && autorepeat.enabled && autorepeat.enabled()) {
                const match = contentLower.match(cooldownRegex);
                if (match && match[1]) {
                    const cooldownAmount = parseInt(match[1], 10);
                    logger.debug(`Cooldown set to ${cooldownAmount}s. Putting the interaction in the queue.`);
                    const expiresAt = Date.now() + cooldownAmount * 1000;
                    cooldownQueue.set(client.lastInteraction, expiresAt);
                }
            }
        }
        
        // if it doesn't match either cooldown or botMessage, lets see if it's a message from a user on userphone
        if (userphoneRegex.test(content)) {
            logger.debug("figured it out, the message is a userphone message");
            const match = content.match(userphoneRegex);
            const username = match?.[1]?.trim();

            if (username && regexfilter && regexfilter.enabled && regexfilter.enabled()) {
                if (!regexfilter.checkUsername({ username })) {
                    logger.debug(`Userphone message from ${username} does not match regex filter.`);
                    const channel = client.channels.cache.get(process.env.allowed_channel_id);
                    
                    // mods, ban this person NOW!!!
                    channel.sendSlash(process.env.bot_id, "hangup").then(() => {
                        logger.debug(`Attempt to hang up userphone for invalid username: ${username}`);
                    }).catch(err => {
                        logger.error(`Failed to hang up userphone for invalid username`, err);
                    });
                }
            }
        }
    }

    // if it doesn't match anything else, then i dont fucking know what it is + we don't care 
    // unless ygg pushed a update for messages / switched up their messages
}

module.exports = {
    figureItOut, cooldownQueue
}