import * as Discord from "discord.js";
import { keepAlive } from "./server";
import { CoCoModule } from "./interfaces";
import HelpModule from "./modules/help";
import InfoModule from "./modules/info";
import reactionRoleModule from "./modules/reaction-role";
import StonksModule from "./modules/stonks";
import ProfileModule from "./modules/profile";
import PointsModule from "./modules/points";
import { run } from './instagram/instagram';
import { startJob } from './timed_messages/newyear';

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
InitializeModule(ProfileModule);
InitializeModule(PointsModule);

// Bot start
client.on('ready', () => {
  client.user?.setActivity("with people", { type: "PLAYING" });
  console.log('CoCo is online.');
});

// Message handling
client.on('messageCreate', async message => {

  // Skip if message from bot
  if (message.author.bot)
    return;

  // Welcome channel is undefined when not found
  let welcomeChannel = message.guild?.channels.cache.find(c => c.name === 'welcome');
  if (welcomeChannel && message.channelId === welcomeChannel.id) {
    let ran = Math.floor((Math.random() * 10) + 1);
    if (ran === 1)
      message.channel.send("I lost my life savings from dogecoin now go read <#897566470387671092>");
    else if (ran === 2)
      message.channel.send("I bet you won't read <#897566470387671092>");
    else if (ran === 3)
      message.channel.send("Read <#897566470387671092> if you want rough brain");
  }

  if (!message.content.startsWith(prefix))
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

// Instagram Post Webhook
run();

// Sends New Year Message
startJob(client);
