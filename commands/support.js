module.exports = {
    name: 'support',
    description: 'support command',
    async execute(message, args, cmd, client, Discord){

        const newEmbed1 = new Discord.MessageEmbed()
        .setColor("#FFFFFF")
        .setDescription("Join our [support server](https://discord.gg/ctQezgBmcx) if you would like to see future announcements or just need some assistance using our discord bot")
        
        message.channel.send(newEmbed1)
    }
}