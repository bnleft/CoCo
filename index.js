// Imports
const Discord = require('discord.js');
const keepAlive = require('./server');
const fs = require('fs');

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

// Creating collection of commands adn events
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Events (WIP)
//const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));


// Bot start
client.on('ready', () => {
    client.user.setActivity("with people", {type: "PLAYING"});
    console.log('CoCo is online.');
});

// Message handling
client.on('messageCreate', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) 
        return;
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    
    if(command === 'help')
        client.commands.get('help').execute(message, args, commandFiles, Discord);
    else if(command === 'info')
        client.commands.get('info').execute(message, args, client);

});

// Add reaction handling
client.on('messageReactionAdd', async (reaction, user) => {
    const rulesMessageID = '898697885863002113';
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
    const rulesMessageID = '898697885863002113';
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