const Canvas = require('canvas');
const { registerFont } = require('canvas');
const path = require('path');

module.exports = {
    name: 'stonks',
    permission: 'everyone',
    description: 'Short squeeze',
    async execute(message, args, client, Discord){
        const canvas = Canvas.createCanvas(1568, 1585);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage(
            path.join(__dirname, './assets/images/stonks.png')
        )
        let x = 0;
        let y = 0;
        let i = 0;
        var str = "";
        while(args[i] != undefined){
            str += args[i] + " ";
            i++;
        }

        ctx.drawImage(background, x, y);

        const pfp = await Canvas.loadImage(
            message.member.user.displayAvatarURL({
                format: 'png',
            })
        )
        x = 230 - pfp.width/2;
        y = 490 - pfp.height/2;
        ctx.drawImage(pfp, x, y, 400, 400);
        let mes;
        if(str == ""){
            mes = ``;
            message.channel.send(`\`\`\`Syntax: coco-stonks (any)\`\`\``);
            return;
        }
        else{
            mes = `${str}`;
        }

        registerFont('./commands/assets/fonts/Roboto-Bold.ttf', { family: 'sans-serif' });
        ctx.font = 'bold 100px sans-serif';

        x = canvas.width / 2 - ctx.measureText(mes).width/2;
        y = 200;
        ctx.fillText(mes, x, y);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer());
        message.channel.send({ files: [attachment] });

    }
}