import {CoCoModule} from "../interfaces";
import * as Discord from "discord.js";

const HelpModule: CoCoModule = {
  name: 'help',
  permission: 'everyone',
  description: 'Displays all commands',
  command(message, args, client, modules) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle('Commands');
    embed.setDescription('prefix is coco-');
    embed.setColor('#2F4562');

    let keys = Array.from(modules.keys());
    keys.sort();

    for (const key of keys) {
      const module = modules.get(key);
      if (!module) continue;

      if (args[0]) {
        if (module.name === args[0]) {
          embed.addFields(
            {name: `${module.name}`, value: `role: ${module.permission}\ndesc: ${module.description}`}
          );
          break;
        }
      } else {
        embed.addFields(
          {name: `${module.name}`, value: `role: ${module.permission}\ndesc: ${module.description}`}
        );
      }
    }

    message.channel.send({
      embeds: [embed]
    });
  }
}
export default HelpModule;