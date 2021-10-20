module.exports = {
    name: 'help',
    permission: 'everyone',
    description: 'Displays all commands',
    execute(message, args, commandFiles, Discord){
        const embed = new Discord.MessageEmbed();
        embed.setTitle('Commands');
        embed.setDescription('prefix is coco-');
        embed.setColor('2F4562');

        commandFiles.sort();
        
        for(const file of commandFiles){
            const command = require(`./${file}`);
            
            if(args[0]){
                if(command.name === args[0]){
                    embed.addFields(
                        { name: `${command.name}`, value: `role: ${command.permission}\ndesc: ${command.description}`}
                    );
                    break;
                }
            }else{
                embed.addFields(
                        { name: `${command.name}`, value: `role: ${command.permission}\ndesc: ${command.description}`}
                );
            }
        }

        message.channel.send({
            embeds: [ embed ]
        });
    }
}