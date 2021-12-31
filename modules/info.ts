import {
  OFFICERS_MESSAGE,
  OFFICERS_MESSAGE_ID,
  RULES_MESSAGE,
  RULES_MESSAGE_ID,
  SOCIALS_MESSAGE,
  SOCIALS_MESSAGE_ID,
  ABOUTUS_MESSAGE1,
  ABOUTUS_MESSAGE2,
  ABOUTUS_MESSAGE1_ID,
  ABOUTUS_MESSAGE2_ID,
  FESTIVE_POEM,
  FESTIVE_POEM_ID
} from "../data/info";
import {CoCoModule} from "../interfaces";
import {Client, Message, TextChannel, MessageAttachment} from "discord.js";

const cocophone = './modules/assets/images/cocophones.png';
const cocopose1 = './modules/assets/images/pose1.png';
const cocofriend = './modules/assets/images/cocofriend.png';
const cocofestive = './modules/assets/images/festivecoco.png';

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
    else if (args[0] == 'aboutus1')
      sendInfo(message, client, 'about-us1', ABOUTUS_MESSAGE1, ABOUTUS_MESSAGE1_ID);
    else if (args[0] == 'aboutus2')
      sendInfo(message, client, 'about-us2', ABOUTUS_MESSAGE2, ABOUTUS_MESSAGE2_ID);
    else if (args[0] == 'festivepoem')
      sendInfo(message, client, 'announcements', FESTIVE_POEM, FESTIVE_POEM_ID);
    else
      return message.channel.send('coco-info <rules/officers/socials> ');
    return message.channel.send('Edit success.');
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

const sendInfo = async(message: Message, client: Client, channelName: string, infoMessage: string, infoMessageID: string) => {
  
  let name = channelName;
  if(name.substr(0, name.length - 1) == 'about-us')
    name = name.substr(0, name.length-1);

  const channelID = message.guild?.channels.cache.find(c => c.name === name)?.id;

  if (!channelID) return;
  if (!infoMessageID) {
    if(channelName == 'about-us1')
      await (client.channels.cache.get(channelID) as TextChannel | null)?.send({
        files: [cocopose1]
      });
    if(channelName == 'about-us2')
      await (client.channels.cache.get(channelID) as TextChannel | null)?.send({
        files: [cocofriend]
      });
    return (client.channels.cache.get(channelID) as TextChannel | null)?.send(infoMessage).then(m => {
      if (channelName == 'rules')
        m.react('🥥');
      if (channelName == 'socials'){
          m.channel.send({
            files: [cocophone]
          });
        }
      if (channelName == 'announcements'){
          m.channel.send({
            files: [cocofestive] 
          });
        }
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
