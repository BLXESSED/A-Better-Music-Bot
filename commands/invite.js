module.exports = {
    name: 'invite',
    description: 'invite command',
    async execute(message, args, cmd, client, Discord){

        const newEmbed1 = new Discord.MessageEmbed()
        .setColor("#008a96")
        .setDescription("Click [here](https://discord.com/oauth2/authorize?client_id=832063705021284362&scope=bot&permissions=573754624) to invite A Better Music Bot to your server")
        
        message.channel.send(newEmbed1)
    }
}