const regex = /^.*<@(?:&(\d+)|([^\n:<>@&]+))>.*?((?:<a?)?:[^\n: ]+:(?:\d+>)?|(?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]))/;
const reaction_regex = new RegExp(regex, "gm")
const reaction_regex_single_line = regex;
const channel_regex = /^<#(\d+)>/;
const role_regex = /(^.*)(<@(?:&(\d+)|([^\n:<>@&]+))>)/gm;

module.exports = {
    name: 'reaction-role',
    permission: 'Wizard',
    description: 'Creates a reaction embed in the specified channel.',
    async execute(message, args, client){
        // Wizard Permission level, this should be done in createMessage handler by checking the permissions field.
        let wizRole = message.member.roles.cache.filter(role => role.name === 'Wizard');
        if(wizRole.size === 0)
            return message.channel.send('You are not the bot wizard.');

        // Guild Command Only
        if(!message.guild) return message.reply('This command is only available in a guild.');
        let body = message.content;
        // Trim off the command prefix
        body = body.substr(body.indexOf(' ')).trim();
        // Trim off the channel
        let channel = body.match(channel_regex);
        if(!channel || !channel[1]) return usage(message);
        body = body.replace(channel_regex,'').trim();
        let channelId = channel[1];
        // Validate that this channel is from the origin guild
        let channelReference = await message.guild.channels.fetch(channelId).catch(_=>undefined);
        if(!channelReference) return message.reply('I couldn\'t find that channel.');
        // Parse body for reaction roles
        let reactionDefinitions = parseMessageBody(body);
        if(!reactionDefinitions) return usage(message);
        // Resolve roles
        let abort = false;
        reactionDefinitions =
            await Promise.all(
                reactionDefinitions.map(
                    def => resolveRoleFor(def, message.guild)
                )
            )
            .catch(_ => abort = true);
        if(abort){
            message.reply("I need permission to manage roles in order to create new roles.");
            return;
        }
        // Update message
        body = body.replace(role_regex, function(m,g1,g2,id,name){
            if(id) return m;
            let def = reactionDefinitions.find(d => d.name === name);
            if(def) return g1+`<@&${def.role}>`;
            return m;
        });
        // Create the message
        let reactionMessage = await channelReference.send({
            embeds: [{
                description: body
            }]
        });
        // React to said message
        reactionDefinitions.forEach(def => {
            reactionMessage.react(def.emoji).catch(()=>{
                message.reply("Unable to react with: "+def.emoji+", you may have to do this manually.");
            });
        });
    },
    service(client){
        client.on("messageReactionAdd",async (reaction,user)=>{
            if(user.bot) return;
            let channel = await client.channels.fetch(reaction.message.channelId)
            let message = await channel.messages.fetch(reaction.message.id);
            if(message.author.id !== client.user.id || message.content || message.embeds.length !== 1) return;
            // Parse
            let roles = parseMessageBody(message.embeds[0].description);
            if(!roles || roles.length < 1) return;
            // Parsed
            let roleDefinition = roles.find(r => r.emoji === reaction.emoji.toString());
            if(!roleDefinition) return;
            let member = await message.guild.members.fetch(user.id);
            if(!member) return;
            member.roles.add(roleDefinition.role).catch(_=>undefined);
        });
        client.on("messageReactionRemove",async (reaction,user)=>{
            if(user.bot) return;
            let channel = await client.channels.fetch(reaction.message.channelId)
            let message = await channel.messages.fetch(reaction.message.id);
            if(message.author.id !== client.user.id || message.content || message.embeds.length !== 1) return;
            // Parse
            let roles = parseMessageBody(message.embeds[0].description || "");
            if(!roles || roles.length < 1) return;
            // Parsed
            let roleDefinition = roles.find(r => r.emoji === reaction.emoji.toString());
            if(!roleDefinition) return;
            let member = await message.guild.members.fetch(user.id);
            if(!member) return;
            member.roles.remove(roleDefinition.role).catch(_=>undefined);
        });
    }
}

function parseMessageBody(body){
    // Good to go, parse the roles in the message
    let reactionRoles = body.match(reaction_regex);
    if(!reactionRoles || !reactionRoles.length) return undefined;
    // We have multiple, extrapolate.
    return reactionRoles.map(r => {
        // This match was pre-ensured by the reaction_regex
        let match = r.match(reaction_regex_single_line);
        return {role:match[1], name:match[2], emoji:match[3]};
    });
}
async function resolveRoleFor(definition, guild){
    // Role id is already resolved
    if(definition.role) return definition;
    // Load roles
    let roles = await guild.roles.fetch().catch(_=>[]);
    // Attempt to find by name
    let role = roles.find(r=>r.name===definition.name);
    // Resolve role if found
    if(role){
        definition.role = role.id;
        return definition;
    }
    // Create role if missing
    return guild.roles.create({name: definition.name}).then(role => {
        // Resolve role and return
        definition.role = role.id;
        return definition;
    });
}

// Messy usage message
function usage(message){
    message.reply(`Usage: reaction-role #channel-mention
Now you can type whatever you want here
Any line that has a role @Mention and an :emoji:
will become a reaction assignable role.
if you have multiple roles you ant to be assignable
make sure each @Role and :emoji: are on separate lines.
you can also have the bot create roles that do not yet exist for you
by using <@My New Cool Role Name> or course with an :emoji: on the same line
And here is the exact regex used if you're curious.
^.*<@(?:&(\\d+)|([^\\n:<>@&]+))>.*?((?:<a?)?:[^\\n: ]+:(?:\\d+>)?|(?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]))
Final thing, at least one reaction role is required.`)
}