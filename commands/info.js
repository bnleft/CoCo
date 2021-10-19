module.exports = {
    name: 'info',
    category: 'Wizard',
    description: 'Sends messages to certain channels in information category',
    execute(message, args, client){
        let wizRole = message.member.roles.cache.filter(role => role.name === 'Wizard');
        
        if(wizRole.size == 0)
            return message.channel.send('You are not the bot wizard.');
        
        if(args[0] == 'rules')
            rules(message, client);
        else if(args[0] == 'officers')
            officers(message, client);
        else if(args[0] == 'socials')
            socials(message, client);
        else
            return message.channel.send('Valid arguments needed.');

    }
}

// #rules
const rules = (message, client) => {
    const channelID = message.guild.channels.cache.find(c => c.name === 'rules').id;

    const rulesMessage = 
`\`\`\`prolog\n
Code Coogs Discord Rules

=================================================================================================

1 | Be respectful, civil, and welcoming.

2 | No inappropriate or unsafe content.

3 | Do not misuse or spam in any of the channels.

4 | Any content that is NSFW is not allowed under any circumstances.

5 | Discord names and avatars must be appropriate.

6 | Anything to target specific groups/individuals is prohibited.

7 | Do not record voice channel conversations.

8 | Discriminatory language and hate speech is forbidden.

9 | Bullying and harassment is not tolerated.

=================================================================================================

Subject to change.

React to gain access other channels
\`\`\``;

    const messageID = '898697885863002113';

    if(!messageID)
        return client.channels.cache.get(channelID).send(rulesMessage).then(m => {
            m.react('🥥');
        });
    else
        return client.channels.cache.get(channelID).messages.fetch(messageID)
        .then(m => {
            m.edit(rulesMessage);
            m.react('🥥');
        });
};

// #officers
const officers = (message, client) => {
    const channelID = message.guild.channels.cache.find(c => c.name === 'officers').id;

    const officersMessage = 
`\`\`\`yaml
Code Coogs Officers

=================================================================================================

President : Tailer 

VP of External Affairs : Janice 

VP of Internal Affairs : Rodolfo

Treasurer : Jennifer F

Marketing Director : Lupita

Activities Director : Grace

Artist : Jennifer H

Competitive Programming Director : Nghia 

Discord Bot Wizard : Bryant

Webmaster : Cesar

Workshop Director : Abdullah

Workshop Tutor : Eithan, Frank, Bryant, Nghia, Noah, Cindy, Abdullah

=================================================================================================

Subject to change.

\`\`\``;

    const messageID = '899830901146521601';

    if(!messageID)
        return client.channels.cache.get(channelID).send(officersMessage);
    else
        return client.channels.cache.get(channelID).messages.fetch(messageID)
        .then(m => {
            m.edit(officersMessage);
        });
}

// #socials
const socials = (message, client) => {
    const channelID = message.guild.channels.cache.find(c => c.name === 'socials').id;

    const socialsMessage = `
Instagram | https://www.instagram.com/uh_codecoogs/
`;

    const messageID = '899884077157605457';

    if(!messageID)
        return client.channels.cache.get(channelID).send(socialsMessage);
    else
        return client.channels.cache.get(channelID).messages.fetch(messageID)
        .then(m => {
            m.edit(socialsMessage);
        });    
}