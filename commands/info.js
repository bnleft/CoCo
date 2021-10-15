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
        else
            return message.channel.send('Arguments needed.');

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

    const messageID = '';

    if(!messageID)
        return client.channels.cache.get(channelID).send(rulesMessage).then(m => {
            m.react('🥥');
        });
    else
        client.channels.cache.get(channelID).messages.fetch(messageID)
        .then(m => {
            m.edit(rulesMessage);
            m.react('🥥');
        });
};
