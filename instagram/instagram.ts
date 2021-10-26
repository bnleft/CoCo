import * as Discord from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';
import fetch from "node-fetch";

dotenv.config();

const instaUsername = process.env.INSTAGRAM_USERNAME || 'uh_codecoogs';
const discordWebHookID: any = process.env.INSTAGRAM_WEBHOOK_ID;
const discordWebHookToken: any = process.env.INSTAGRAM_WEBHOOK_TOKEN;
const discordWebHookClient = new Discord.WebhookClient({id: discordWebHookID, token: discordWebHookToken});
const instaURL = `https://www.instagram.com/${instaUsername}/channel/?__a=1`;
const instaCookie = process.env.INSTAGRAM_COOKIE;
const lastPostPath = './instagram/lastPostID.txt';

const getData = async() => {

    var options: any = {
        muteHttpExcecptions: true,
        "headers": {
            'Cookie': instaCookie
        }
    };

    let jsonData = await fetch(instaURL, options)
    .then((res) => {
        return res.text();
    })
    .then((text) => {
        return JSON.parse(text);
    });

    setTimeout(() => {
        testPost(jsonData);
    }, 20000);
}

const testPost = (jsonData: any, ) => {
    let oldPostID: any;

    setTimeout(() => {
        fs.access(lastPostPath, fs.constants.R_OK, (err) => {
            if(!err){
                fs.readFile(lastPostPath, 'utf-8', (err, data) => {
                    if(!err)
                        oldPostID = data;
                    else
                        console.error(err);
                });
            }
            else
                console.error(err);
        });
    }, 10000);

    let newPostID = jsonData["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"][0]["node"]["shortcode"];

    setTimeout(() => {
        checkNewPost(jsonData, oldPostID, newPostID)
    }, 20000);
};

const checkNewPost = (jsonData: any, oldPostID: any, newPostID: any) => {
    if(oldPostID != newPostID){
        sendPost(jsonData);

        fs.access(lastPostPath, fs.constants.R_OK, (err) => {
            if(!err){
                fs.writeFile(lastPostPath, newPostID, (err) => {
                    if(err)
                        console.error(err);
                })
            }
            else
                console.error(err);
        });

    }

}

const sendPost = (jsonData: any) => {
    const embed = new Discord.MessageEmbed();

    const author = instaUsername;
    const authorURL = `https://www.instagram.com/${instaUsername}/`;
    const authorAvatarURL = jsonData["graphql"]["user"]["profile_pic_url_hd"];
    const title = `@${instaUsername}`;
    const url = `https://www.instagram.com/p/${jsonData["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"][0]["node"]["shortcode"]}/`;
    const caption = jsonData["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"][0]["node"]["edge_media_to_caption"]["edges"][0]["node"]["text"] || 'No caption.'; 
    const image = jsonData["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"][0]["node"]["display_url"];
    
    embed.setAuthor(author)
    .setAuthor(author, authorAvatarURL, authorURL)
    .setTitle(title)
    .setURL(url)
    .setImage(image)
    .setColor([47, 69, 98])
    .setTimestamp();

    if(caption)
        embed.setDescription(caption);

    discordWebHookClient.send({
        username: instaUsername,
        avatarURL: authorAvatarURL,
        embeds: [embed]
    });
}   


export async function run(){
    setInterval(() => {  
        setTimeout(() => {
            getData();
        }, 10000);
    }, 20000);
};