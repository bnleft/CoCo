import Discord from "discord.js";
import {keepAlive} from "./server";
import {CoCoModule} from "./interfaces";
import HelpModule from "./modules/help";
import InfoModule from "./modules/info";
import reactionRoleModule from "./modules/reaction-role";
import StonksModule from "./modules/stonks";

// Configuration
require('dotenv').config();
const token = process.env.TOKEN;
const prefix = process.env.PREFIX || 'coco-';

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

// Creating collection of command modules
let modules: Discord.Collection<string, CoCoModule> = new Discord.Collection();
InitializeModule(HelpModule);
InitializeModule(InfoModule);
InitializeModule(reactionRoleModule);
InitializeModule(StonksModule);

// Bot start
client.on('ready', () => {
  client.user?.setActivity("with people", {type: "PLAYING"});
  console.log('CoCo is online.');
});

// Message handling
client.on('messageCreate', async message => {
  // Welcome channel is undefined when not found
  let welcomeChannel = message.guild?.channels.cache.find(c => c.name === 'welcome');
  if (welcomeChannel && message.channelId === welcomeChannel.id) {
    let ran = Math.floor((Math.random() * 10) + 1);
    if (ran === 1)
      message.channel.send("I lost my life savings from dogecoin now go read #rules");
    else if (ran === 2)
      message.channel.send("I bet you won't read #rules");
    else if (ran === 3)
      message.channel.send("Read #rules if you want rough brain");
  }

  if (!message.content.startsWith(prefix) || message.author.bot)
    return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift()?.toLowerCase();

  if (!command) return;

  // Get the command by name in the collection
  let commandHandler = modules.get(command);
  // Abort when the command is undefined
  if (!commandHandler) return;
  // All commands use this interface
  if (commandHandler.command) commandHandler.command(message, args, client, modules);
});

// Host server
keepAlive();

// Login with token
client.login(token).catch(() => {
});

function InitializeModule(module: CoCoModule) {
  modules.set(module.name, module);
  if (module.service) module.service(client);
}