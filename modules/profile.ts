import { MessageEmbed, MessageMentions } from "discord.js";
import { CoCoModule } from "../interfaces";
import { stripIndents } from 'common-tags';

const ProfileModule: CoCoModule = {
    name: 'profile',
    permission: 'everyone',
    description: 'Display profile information',
    command(message, args) {
              
        const embed = new MessageEmbed();
        let roles: String = "";
        let userID: String = message.author.id;

        // Default is author's profile, otherwise mention's profile
        if(args[0]){
            const matches = args[0].match(MessageMentions.USERS_PATTERN);
            if(!matches)
                return message.channel.send('coco-profile @Mention');
            userID = matches[0].substring(matches[0].indexOf('!')+1, matches[0].indexOf('>'));
        }
        
        const theMember = message.guild.members.cache.find(user => user.id === userID);

        theMember.roles.cache.forEach(rID => {
            if(rID.name !== '@everyone')
                roles += '\n<@&' + rID + '>';
        });

        embed.setTitle('Profile');
        embed.setThumbnail(theMember.user.avatarURL({ dynamic:true }));
        embed.setColor([47, 69, 98]);

        embed.addField(
            'Member Information', stripIndents`**__Display Name__**\n ${theMember.displayName} 
            **__Join Date__**\n ${Intl.DateTimeFormat('en-US').format(theMember.joinedAt)} 
            **__Roles__ **${roles}`, true);
        
        embed.addField(
            'User Information', stripIndents`**__ID__**\n ${theMember.user.id}
            **__Username__**\n ${theMember.user.username}
            **__Tag__**\n ${theMember.user.tag}
            **__Creation Date__**\n ${Intl.DateTimeFormat('en-US').format(theMember.user.createdAt)}`, true);
        
        embed.setFooter(message.guild.name, message.guild.iconURL());

        message.channel.send({
            embeds: [embed]
        });
    }
}

export default ProfileModule;