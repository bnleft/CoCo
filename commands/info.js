const {
    RULES_MESSAGE_ID,
    OFFICERS_MESSAGE_ID,
    SOCIALS_MESSAGE_ID,
    RULES_MESSAGE,
    OFFICERS_MESSAGE,
    SOCIALS_MESSAGE,
} = require('../data/info');

module.exports = {
    name: 'info',
    permission: 'Wizard',
    description: 'Sends messages to certain channels in information category',
    execute(message, args, client, Discord){
        let wizRole = message.member.roles.cache.filter(role => role.name === 'Wizard');
        
        if(wizRole.size == 0)
            return message.channel.send('You are not the bot wizard.');
        
        if(args[0] == 'rules')
            sendInfo(message, client, 'rules', RULES_MESSAGE, RULES_MESSAGE_ID);
        else if(args[0] == 'officers')
            sendInfo(message, client, 'officers', OFFICERS_MESSAGE, OFFICERS_MESSAGE_ID);
        else if(args[0] == 'socials')
            sendInfo(message, client, 'socials', SOCIALS_MESSAGE, SOCIALS_MESSAGE_ID);
        else
            return message.channel.send('coco-info <rules/officers/socials> ');

    }
}

const sendInfo = (message, client, channelName, infoMessage, infoMessageID) => {
    const channelID = message.guild.channels.cache.find(c => c.name === channelName).id;

    if(!infoMessageID){
        return client.channels.cache.get(channelID).send(infoMessage).then(m => {
            if(channelName == 'rules')
                m.react('🥥');
        });
    }
    else
        return client.channels.cache.get(channelID).messages.fetch(infoMessageID)
        .then(m => {
            m.edit(infoMessage);
            if(channelName == 'rules')
                m.react('🥥');
        });
};
