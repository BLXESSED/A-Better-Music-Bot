module.exports = {
    name: 'ping',
    description: 'gives you the bots ping',
    async execute(message, args, cmd, client, Discord){
    message.channel.send('Pinging...').then (async (msg) =>{

    const newEmbed = new Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setDescription(`Ping is ${msg.createdTimestamp - message.createdTimestamp}ms. API Ping is ${Math.round(client.ws.ping)}ms`)
    
    msg.delete()
            
    message.channel.send(newEmbed)
});
    }
}