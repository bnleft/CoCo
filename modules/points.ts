import { 
    CoCoModule,
    MemberData,
    MembersData,
} from "../interfaces";
import { runGS } from "../googleapi/googlesheets";
import * as Discord from "discord.js";

const USER_PATTERN = /<((@!?\d+)|(:.+?:\d+))>/g;

const PointsModule: CoCoModule = {
    name: 'points',
    permission: 'everyone',
    description: 'Display member points',
    async command(message, args, client){
        if(args[0] == undefined) {
            return message.channel.send(`coco-points me \n Display your points \n\n coco-points lb \n Display leaderboard \n\n coco-points @mention \n Display mentioned user's points`);
        }

        // Array of objects
        let membersData: MembersData = await runGS();

        // Displays message's author points
        if(args[0] == "me"){

            const tag = message.author.tag;
            
            if(tag in membersData){
                const memberData: MemberData = membersData[tag];
                return message.channel.send(`${memberData.name}, you have ${memberData.point} coco points.`);
            }

            return message.channel.send(`You are not in the database. If you should be, contact wizard.`);

        }
        // Leaderboard
        else if(args[0] == "lb"){

            const embed = new Discord.MessageEmbed();

            // How many people to display on leaderboard
            const top = 5;

            embed.setTitle(`Top ${top} Leaderboard`);
            embed.setColor('#2F4562');

            let membersDataArr = Object.keys(membersData).map((key) => {
                return [key, membersData[key]];
            });

            membersDataArr.sort((a: any, b: any) => {
                let aN = parseInt(a[1].point);
                let bN = parseInt(b[1].point);
                return ((aN > bN) ? -1 : ((aN < bN) ? 1 : 0));
            });

            let topMembersData = membersDataArr.slice(0, top);

            for(let i = 0; i < top; i++){
                const memberData: any = topMembersData[i][1];
                embed.addFields(
                    {name: `${i+1} | ${memberData.name}`, value: `${memberData.point} coco`}
                );
            }

            return message.channel.send({
                embeds: [embed]
            });

        }
        else if (args[0].matchAll(USER_PATTERN)){
            const mention = args[0];

            const userId = mention.slice(2, -1);

            const user = client.users.cache.get(userId);

            if (!user) {
                return message.channel.send("Person does not exist.");
            }

            const mentionMemberData = membersData[user.tag];

            return message.channel.send(`${mentionMemberData.name} has ${mentionMemberData.point} coco points.`);
        }

    }
}

export default PointsModule
