// Imports
const Discord = require('discord.js');
const keepAlive = require('./server');
const fs = require('fs');

const {
    RULES_MESSAGE_ID,
} = require('./data/info');

// Configuration
require('dotenv').config();
const token = process.env.TOKEN;
const prefix = 'coco-';



// Defining bot
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS, 
        Discord.Intents.FLAGS.GUILD_MESSAGES, 
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    partials: [
        'MESSAGE', 
        'CHANNEL', 
        'REACTION'
    ],
});

// Creating collection of commands
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Bot start
client.on('ready', () => {
    client.user.setActivity("with people", {type: "PLAYING"});
    console.log('CoCo is online.');
});

// Message handling
client.on('messageCreate', message => {
    
    if(message.channel.id === message.guild.channels.cache.find(c => c.name === 'welcome').id){
        var ran = Math.floor((Math.random() * 10) + 1);
        if(ran === 1)
            message.channel.send("I lost my life savings from dogecoin now go read #rules");
        else if(ran === 2)
            message.channel.send("I bet you won't read #rules");
        else if(ran === 3)
            message.channel.send("Read #rules if you want rough brain");
    }
    
    if(!message.content.startsWith(prefix) || message.author.bot) 
        return;
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    
    if(command === 'help')
        client.commands.get('help').execute(message, args, commandFiles, Discord);
    else if(command === 'info')
        client.commands.get('info').execute(message, args, client);
    else if(command === 'stonks')
        client.commands.get('stonks').execute(message, args, Discord);

});

// Add reaction handling
client.on('messageReactionAdd', async (reaction, user) => {
    const rulesMessageID = RULES_MESSAGE_ID;
    if(reaction.partial){
        if(reaction.message.id === rulesMessageID){
            const { guild } = reaction.message;
            const cooderRole = guild.roles.cache.find(r => r.name === 'Cooder');
            const member = guild.members.cache.find(m => m.id === user.id);
            member.roles.add(cooderRole);
        }
    }
});

// Remove reaction handling
client.on('messageReactionRemove', async (reaction, user) => {
    const rulesMessageID = RULES_MESSAGE_ID;
    if(reaction.partial){
        if(reaction.message.id === rulesMessageID){
            const { guild } = reaction.message;
            const cooderRole = guild.roles.cache.find(r => r.name === 'Cooder');
            const member = guild.members.cache.find(m => m.id === user.id);
            member.roles.remove(cooderRole);
        }
    }
});

// Host server
keepAlive();

// Login with token
client.login(token);