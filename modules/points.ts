import { CoCoModule } from "../interfaces";
import { runGS } from "../googleapi/googlesheets";
import * as Discord from "discord.js";

const PointsModule: CoCoModule = {
    name: 'points',
    permission: 'everyone',
    description: 'Display member points',
    async command(message, args){
        
        // Object of arrays
        // One for names
        // One for discord tags
        // One for points
        let memberData = await runGS();
   
        // Displays message's author points
        if(args[0] == "me"){

            const tag = message.author.tag;
            
            let i;
            for(i = 0; i <= memberData.length; i++){
                if(i == memberData.length || tag == memberData[i].tag)
                    break; 
            }

            // Can't find user
            if(i == memberData.length){
                message.channel.send(`You are not in the database. If you should be, contact wizard.`);
            }
            else{
                message.channel.send(`${memberData[i].name}, you have ${memberData[i].point} coco points.`);
            }

            return;
        }
        // Leaderboard
        else if(args[0] == "lb"){

            const embed = new Discord.MessageEmbed();

            // How many people to display on leaderboard
            const top = 5;

            embed.setTitle(`Top ${top} Leaderboard`);
            embed.setColor('#2F4562');

    
            memberData.sort((a, b) => {
                let aN = parseInt(a.point);
                let bN = parseInt(b.point);
                return ((aN > bN) ? -1 : ((aN < bN) ? 1 : 0));
            });

            for(let i = 0; i < top; i++){
                embed.addFields(
                    {name: `${i+1} | ${memberData[i].name}`, value: `${memberData[i].point} coco`}
                );
            }

            message.channel.send({
                embeds: [embed]
            });

            return;
        }

        message.channel.send(`coco-points me \n Display your points \n\n coco-points lb \n Display leaderboard`);

    }
}

export default PointsModule
