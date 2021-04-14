module.exports = async (Discord, client, message) => {

    const prefix = "m!";

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.substring(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    try {
        command.execute(message, args, cmd, client, Discord)
    } catch (err) {
        console.log(err);
    }
}