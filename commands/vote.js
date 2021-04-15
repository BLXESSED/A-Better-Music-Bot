module.exports = {
    name: 'vote',
    description: 'vote command',
    async execute(message, args, cmd, client, Discord){

        const newEmbed1 = new Discord.MessageEmbed()
        .setColor("#008a96")
        .setDescription("We'll really appreciate it if you can vote for our bot on [top.gg](https://top.gg/bot//vote)")
        
        message.channel.send(newEmbed1)
    }
}