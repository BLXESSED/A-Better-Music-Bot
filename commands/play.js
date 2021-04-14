const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const queue = new Map();

module.exports = {
    name: 'play',
    aliases: ['skip', 'stop', 'join', 'leave'],
    description: 'Advanced music bot',
    async execute(message, args, cmd, client, Discord, profileData){

        const newEmbed1 = new Discord.MessageEmbed()
        .setColor("#FFFFFF")
        .setTitle("Help")
        .setDescription("`c!play [song/youtube link]`")

        const newEmbed2 = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setTitle("🎶 Music")
        .setDescription('You need to be in a voice channel to execute this command!')

        const newEmbed3 = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setTitle("🎶 Music")
        .setDescription('You dont have the correct permissions')

        const newEmbed4 = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setTitle("🎶 Music")
        .setDescription('I could not find that song/video')

        const newEmbed6 = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setTitle("🎶 Music")
        .setDescription('I can not connect to that voice channel. Please try again later')

        const newEmbed8 = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setTitle("🎶 Music")
        .setDescription('You need to be in a channel to execute this command!')

        const newEmbed9 = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setTitle("🎶 Music")
        .setDescription(`There are no songs in queue`)

        const newEmbed10 = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setTitle("🎶 Music")
        .setDescription(`There is nothing playing`)

        const newEmbed13 = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setTitle("🎶 Music")
        .setDescription(`Bye!`)

        const newEmbed14 = new Discord.MessageEmbed()
        .setColor("#008000")
        .setTitle("🎶 Music")
        .setDescription(`Joining...`)

        const newEmbed15 = new Discord.MessageEmbed()
        .setColor("#008000")
        .setTitle("🎶 Music")
        .setDescription(`Leaving...`)

        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send(newEmbed2);
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send(newEmbed3);

        const server_queue = queue.get(message.guild.id);

        if (cmd === 'play'){
            if (!args.length) return message.channel.send(newEmbed1);
            let song = {};

            if (ytdl.validateURL(args[0])) {
                const song_info = await ytdl.getInfo(args[0]);
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
            } else {
                const video_finder = async (query) =>{
                    const video_result = await ytSearch(query);
                    return (video_result.videos.length > 1) ? video_result.videos[0] : null;
                }

                const video = await video_finder(args.join(' '));
                if (video){
                    song = { title: video.title, url: video.url }
                } else {
                     message.channel.send(newEmbed4);
                }
            }

            if (!server_queue){

                const queue_constructor = {
                    voice_channel: voice_channel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []
                }
                
                queue.set(message.guild.id, queue_constructor);
                queue_constructor.songs.push(song);
    
                try {
                    const connection = await voice_channel.join();
                    queue_constructor.connection = connection;
                    video_player(message.guild, queue_constructor.songs[0]);
                } catch (err) {
                    queue.delete(message.guild.id);
                    const newEmbed11 = new Discord.MessageEmbed()
                    .setColor("#008000")
                    .setTitle("🎶 Music")
                    .setDescription(`Now playing **${song.title}**`)
                    message.channel.send(newEmbed11);
                    throw err;
                }
            } else{
                server_queue.songs.push(song);
                const newEmbed5 = new Discord.MessageEmbed()
                .setColor("#008000")
                .setTitle("🎶 Music")
                .setDescription(`**${song.title}** added to queue!`)
                return message.channel.send(newEmbed5);
            }
        }
        else if(cmd === 'skip'){
            if(!server_queue){
                message.channel.send(newEmbed10)
            }else{
            skip_song(message, server_queue);
            }
        }
        else if(cmd === 'stop'){
            if(!server_queue){
                message.channel.send(newEmbed10)
            }else{
            stop_song(message, server_queue);
            message.channel.send(newEmbed13)
            }
        }else if(cmd === 'join'){
            try{
            voice_channel.join();
            message.channel.send(newEmbed14)
            }catch(err){
                console.log(err)
                message.channel.send(newEmbed6)
            }
        }
    }
    
}

const video_player = async (guild, song) => {
    const song_queue = queue.get(guild.id);

    if (!song) {
        song_queue.voice_channel.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, { filter: 'audioonly' });
    song_queue.connection.play(stream, { seek: 0, volume: 0.5 })
    .on('finish', () => {
        song_queue.songs.shift();
        video_player(guild, song_queue.songs[0]);
    });
    const newEmbed20 = new Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setTitle("🎶 Music")
    .setDescription(`Now playing **${song.title}**`)
    await song_queue.text_channel.send(newEmbed20)
}

const skip_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send(newEmbed8);
    if(!server_queue){
        return message.channel.send(newEmbed9);
    }
    server_queue.connection.dispatcher.end();
}

const stop_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send(newEmbed2);
    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
}