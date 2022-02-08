import * as Discord from 'discord.js';
import cron from 'cron';

import {
    FESTIVE_POEM
} from '../data/info';

const cocofestive = './modules/assets/images/festivecoco.png';


function sendMessage (client: any) {
    const channelID = '897619522863919165'; // 897596353897721907 for testing, otherwise announcements channel
    client.channels.cache.get(channelID).send({
        content: FESTIVE_POEM,
        files: [cocofestive] 
    }); 
}


export function startJob (client: any) {
    let newYearMessage = new cron.CronJob('00 00 00 1 0 *', () => sendMessage(client), null, true, 'America/Chicago');

    newYearMessage.start();
}

