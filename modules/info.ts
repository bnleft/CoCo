import {
  OFFICERS_MESSAGE,
  OFFICERS_MESSAGE_ID,
  RULES_MESSAGE,
  RULES_MESSAGE_ID,
  SOCIALS_MESSAGE,
  SOCIALS_MESSAGE_ID,
} from "../data/info";
import {CoCoModule} from "../interfaces";
import {Client, Message, TextChannel} from "discord.js";

const InfoModule: CoCoModule = {
  name: 'info',
  permission: 'Wizard',
  description: 'Sends messages to certain channels in information category',
  command(message, args, client) {
    let wizRole = message.member?.roles.cache.filter(role => role.name === 'Wizard');

    if (wizRole && wizRole.size == 0)
      return message.channel.send('You are not the bot wizard.');

    if (args[0] == 'rules')
      sendInfo(message, client, 'rules', RULES_MESSAGE, RULES_MESSAGE_ID);
    else if (args[0] == 'officers')
      sendInfo(message, client, 'officers', OFFICERS_MESSAGE, OFFICERS_MESSAGE_ID);
    else if (args[0] == 'socials')
      sendInfo(message, client, 'socials', SOCIALS_MESSAGE, SOCIALS_MESSAGE_ID);
    else
      return message.channel.send('coco-info <rules/officers/socials> ');

  },
  service(client) {
    client.on("messageReactionAdd", async (reaction, user) => {
      if (reaction.message.id === RULES_MESSAGE_ID) {
        const {guild} = reaction.message;
        const cooderRole = guild?.roles.cache.find(r => r.name === 'Cooder');
        const member = guild?.members.cache.find(m => m.id === user.id);
        if (cooderRole) member?.roles.add(cooderRole);
      }
    });
    client.on("messageReactionRemove", async (reaction, user) => {
      if (reaction.message.id === RULES_MESSAGE_ID) {
        const {guild} = reaction.message;
        const cooderRole = guild?.roles.cache.find(r => r.name === 'Cooder');
        const member = guild?.members.cache.find(m => m.id === user.id);
        if (cooderRole) member?.roles.remove(cooderRole);
      }
    });
  }
}

const sendInfo = (message: Message, client: Client, channelName: string, infoMessage: string, infoMessageID: string) => {
  const channelID = message.guild?.channels.cache.find(c => c.name === channelName)?.id;
  if (!channelID) return;
  if (!infoMessageID) {
    return (client.channels.cache.get(channelID) as TextChannel | null)?.send(infoMessage).then(m => {
      if (channelName == 'rules')
        m.react('🥥');
    });
  } else
    return (client.channels.cache.get(channelID) as TextChannel | null)?.messages.fetch(infoMessageID)
      .then(m => {
        m.edit(infoMessage);
        if (channelName == 'rules')
          m.react('🥥');
      });
};

export default InfoModule;