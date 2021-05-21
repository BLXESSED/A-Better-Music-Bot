module.exports = {
    name: 'help',
    description: 'help command',
    async execute(message, args, cmd, client, Discord){

        const newEmbed1 = new Discord.MessageEmbed()
        .setColor("#FFFFFF")
        .setTitle("Help")
        .setDescription("You can find all the commands on this panel. [Click here for more information](https://abettermusicbot.cf/)")
        .addFields(
            {name: '<a:musicbeat:835354164782694440> **Music**', value: "`m!play, m!skip, m!stop, m!join, m!leave, m!nowplaying, m!pause, m!resume`"},
            {name: '<a:gearSpinning:835354164547813396> **Utilities**', value: "`m!ping, m!invite, m!support, m!vote`"},
            {name: '**Invite**', value: "Click [here](https://discord.com/oauth2/authorize?client_id=832063705021284362&scope=bot&permissions=573754624) to invite A Better Music Bot to your server"},
            {name: '**Support**', value: "Join our [support server](https://discord.gg/ctQezgBmcx) if you would like to see future announcements or just need some assistance using our discord bot"},
            {name: '**Vote**', value: "We'll really appreciate it if you can vote for our bot on [top.gg](https://top.gg/bot/832063705021284362/vote)"},
        )

        message.channel.send(newEmbed1)
    }
}