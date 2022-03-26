import * as DiscordJS from "discord.js";
import * as Discord from "discord.js";

export interface CoCoModule {
  name: string,
  permission: string,
  description: string,
  command?: (message: DiscordJS.Message, args: string[], client: DiscordJS.Client, modules: Discord.Collection<string, CoCoModule>) => Promise<any> | any,
  service?: (client: DiscordJS.Client) => Promise<any> | any
};

export interface MemberData {
    name: string,
    point: string 
};

export interface MembersData {
   [key: string]: MemberData
};
