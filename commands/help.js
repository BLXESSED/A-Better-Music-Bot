module.exports = {
    name: 'help',
    description: 'help command',
    async execute(message, args, cmd, client, Discord){

        const newEmbed1 = new Discord.MessageEmbed()
        .setColor("#FFFFFF")
        .setTitle("Help")
        .setDescription("You can find all the commands on this panel. [Click here for more information]()")
        .addFields(
            {name: '** Music**', value: "`-play, skip, stop, join`"},
            {name: '** Utilities**', value: "`-ping, -invite, -support, -vote`"},
            {name: '**<:Invite:829493633576206356> Invite**', value: "Click [here]() to invite LofiBot to your server"},
            {name: '**<:Support:829493633560477766> Support**', value: "Join our [support server](https://discord.gg/) if you would like to see future announcements or just need some assistance using our discord bot"},
            {name: '**<:Vote:829493633534263306> Vote**', value: "We'll really appreciate it if you can vote for our bot on [top.gg](https://top.gg/bot//vote)"},
        )

        message.channel.send(newEmbed1)
    }
}