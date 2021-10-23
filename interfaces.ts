import DiscordJS from "discord.js";
import Discord from "discord.js";

export interface CoCoModule {
  name: string,
  permission: string,
  description: string,
  command?: (message: DiscordJS.Message, args: string[], client: DiscordJS.Client, modules: Discord.Collection<string, CoCoModule>) => Promise<any> | any,
  service?: (client: DiscordJS.Client) => Promise<any> | any
}