const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
var { getTracks, getData, getPreview } = require("spotify-url-info");
var ytpl = require('ytpl');

const queue = new Map();

module.exports = {
    name: 'play',
    aliases: ['skip', 'stop', 'join', 'nowplaying', 'leave', 'resume', 'pause', 'p', 'forcestop', 'forceskip' ],
    description: 'Advanced music bot',
    async execute(message, args, cmd, client, Discord){

        const newEmbed1 = new Discord.MessageEmbed()
        .setColor("#FFFFFF")
        .setDescription("`m!play [keyword or youtube/spotify link]`")

        const newEmbed2 = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setDescription('You need to be in a voice channel to execute this command!')

        const newEmbed3 = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setDescription('You need the `CONNECT` permission to use this command')

        const newEmbed4 = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setDescription('🔎 I could not find that song/video')

        const newEmbed6 = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setDescription('I can not connect to that voice channel. Please try again later')

        const newEmbed8 = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setDescription('You need to be in a channel to execute this command!')

        const newEmbed9 = new Discord.MessageEmbed()
        .setColor("#FF0000")    
        .setDescription(`There are no songs in queue`)

        const newEmbed10 = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setDescription(`There is nothing playing`)

        const newEmbed13 = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setDescription(`🛑 Stopping...`)
        .setFooter(`Stopped by ${message.author.tag}`)

        const newEmbed14 = new Discord.MessageEmbed()
        .setColor("#008000")
        .setDescription(`👍 Joining...`)
        .setFooter(`Requested by ${message.author.tag}`)

        const newEmbed16 = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setDescription("❌ Too many song are already in queue")

        const newEmbed17 = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setDescription(`👋 Leaving...`)
        .setFooter(`Requested by ${message.author.tag}`)

        const newEmbed18 = new Discord.MessageEmbed()
        .setColor("#008000")
        .setDescription(`⏸️ Paused`)
        .setFooter(`Paused by ${message.author.tag}`)

        const newEmbed19 = new Discord.MessageEmbed()
        .setColor("#008000")
        .setDescription(`▶️ Resumed`)
        .setFooter(`Resumed by ${message.author.tag}`)

        const newEmbed23 = new Discord.MessageEmbed()
        .setColor("#008000")
        .setDescription(`⏭️ Skipped`)
        .setFooter(`Skipped by ${message.author.tag}`)


        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send(newEmbed2);
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send(newEmbed3);

        const server_queue = queue.get(message.guild.id);

        if (cmd === 'play' || cmd === 'p'){
            if (!args.length) return message.channel.send(newEmbed1);

            let song = {};

            message.channel.send("🔎 Searching for `" + args.join(' ') + "`")

            try{
                const spotify = await getPreview(args[0]);
                const video_finder = async (query) =>{
                    const video_result = await ytSearch(query);
                    return (video_result.videos.length > 1) ? video_result.videos[0] : null;
                }

                const video = await video_finder(spotify.track);
                if (video){
                    song = { title: video.title, url: video.url, thumbnail: spotify.image, request: message.author.tag }
                } else {
                    message.channel.send(newEmbed4);
                    console.log(spotify.track)
                }    
            }catch(err){

            if (ytdl.validateURL(args[0])) {
                const song_info = await ytdl.getInfo(args[0]);
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url, thumbnail: `https://img.youtube.com/vi/${song_info.videoDetails.videoId}/maxresdefault.jpg`, request: message.author.tag  }
            } else {
                const video_finder = async (query) =>{
                    const video_result = await ytSearch(query);
                    return (video_result.videos.length > 1) ? video_result.videos[0] : null;
                }

                const video = await video_finder(args.join(' '));
                if (video){
                    song = { title: video.title, url: video.url, thumbnail: `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`, request: message.author.tag  }
                } else {
                     message.channel.send(newEmbed4);
                }
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
                    video_player(message.guild, queue_constructor.songs[0], client);
                } catch (err) {
                    queue.delete(message.guild.id);
                    const newEmbed11 = new Discord.MessageEmbed()
                    .setColor("#008000")
                    .setThumbnail(song.thumbnail)
                    .setDescription(`<a:musicbeat:835354164782694440> Now playing **${song.title}**\n\nIf you enjoy using A Better Music Bot, please vote for our bot on [top.gg](https://top.gg/bot/832063705021284362/vote) to help keep our service free`)
                    .setFooter(`Requested by ${song.request}`)
                    message.channel.send(newEmbed11);
                    throw err;
                }
            } else{
                if(server_queue.songs[50]) return message.channel.send(newEmbed16)
                server_queue.songs.push(song);
                const newEmbed5 = new Discord.MessageEmbed()
                .setColor("#008000")
                .setThumbnail(song.thumbnail)
                .setDescription(`**${song.title}** added to queue!\n\nIf you enjoy using A Better Music Bot, please vote for our bot on [top.gg](https://top.gg/bot/832063705021284362/vote) to help keep our service free`)
                .setFooter(`Requested by ${song.request}`)
                return message.channel.send(newEmbed5);
            }
        }
        else if(cmd === 'skip'){
            if(!server_queue){
                message.channel.send(newEmbed10)
            }else{
                if(voice_channel.members.size > 3){

                    const people  = voice_channel.members.size - 1
                    const requiredToSkip_notRounded = people * 0.75
                    const requiredToSkip = Math.floor(requiredToSkip_notRounded)

                    const newEmbed21 = new Discord.MessageEmbed()
                    .setColor("#008000")
                    .setTitle(`⏭️ Vote Skip`)
                    .setDescription(`Click the ✅ if you would like to skip the song, otherwise click the ❌`)
                    .setFooter(`Requested by ${message.author.tag} | Require ${requiredToSkip} people to vote ✅`)
                    const messageEmbed = await message.channel.send(newEmbed21)
                    messageEmbed.react('✅');
                    messageEmbed.react('❌');
                    setTimeout(function(){ 

                        messageEmbed.delete()

                        const wantToSkip = messageEmbed.reactions.cache.get('✅').count

                        if(wantToSkip > requiredToSkip){
                            message.channel.send(newEmbed23)
                            skip_song(message, server_queue);
                        }else{
                            const newEmbed22 = new Discord.MessageEmbed()
                            .setColor("#FF0000")
                            .setDescription(`❌ Vote skip was unsuccessful`)
                            .setFooter(`Requested by ${message.author.tag}`)
                            message.channel.send(newEmbed22)
                        }
                    }, 5000);
                }else{
                    message.channel.send(newEmbed23)
                    skip_song(message, server_queue);
                }
            }
        }
        else if(cmd === 'stop'){
            if(!server_queue){
                message.channel.send(newEmbed10)
            }else{
                if(voice_channel.members.size > 3){

                    const people  = voice_channel.members.size - 1
                    const requiredToStop_notRounded = people * 0.75
                    const requiredToStop = Math.floor(requiredToStop_notRounded) 

                    const newEmbed21 = new Discord.MessageEmbed()
                    .setColor("#008000")
                    .setTitle(`⏭️ Vote Stop`)
                    .setDescription(`Click the ✅ if you would like the bot to stop playing music, otherwise click the ❌`)
                    .setFooter(`Requested by ${message.author.tag} | Require ${requiredToStop} people to vote ✅`)
                    const messageEmbed = await message.channel.send(newEmbed21)
                    messageEmbed.react('✅');
                    messageEmbed.react('❌');
                    setTimeout(function(){ 

                        messageEmbed.delete()

                        const wantToStop = messageEmbed.reactions.cache.get('✅').count

                        if(wantToStop > requiredToStop){
                            message.channel.send(newEmbed13)
                            stop_song(message, server_queue);
                        }else{
                            const newEmbed22 = new Discord.MessageEmbed()
                            .setColor("#FF0000")
                            .setDescription(`❌ Vote stop was unsuccessful`)
                            .setFooter(`Requested by ${message.author.tag}`)
                            message.channel.send(newEmbed22)
                        }
                    }, 5000);
                }else{
                    message.channel.send(newEmbed13)
                    stop_song(message, server_queue);
                }
            }
        }else if(cmd === 'leave'){
            if(!server_queue){
                server_queue.voice_channel.leave()
                message.channel.send(newEmbed17)
            }else{
                stop_song(message, server_queue);
                message.channel.send(newEmbed17)
            }
        }else if(cmd === 'join'){
            try{
            voice_channel.join();
                message.channel.send(newEmbed14)
            }catch(err){
                console.log(err)
                message.channel.send(newEmbed6)
            }
        }else if(cmd === 'nowplaying'){
            if(!server_queue){
                message.channel.send(newEmbed10)
            }else{
                if(server_queue.songs[1]){
                    const newEmbed15 = new Discord.MessageEmbed()
                    .setColor("#FFFFFF")
                    .setDescription(`**Now Playing:**\n${server_queue.songs[0].title}\n*Requested by ${server_queue.songs[0].request}*\n\n**Playing Next:**\n${server_queue.songs[1].title}\n*Requested by ${server_queue.songs[1].request}*`)
                    return message.channel.send(newEmbed15)
                }else{
                    const newEmbed15 = new Discord.MessageEmbed()
                    .setColor("#FFFFFF")
                    .setDescription(`**Now Playing:**\n${server_queue.songs[0].title}\n*Requested by ${server_queue.songs[0].request}*`)
                    return message.channel.send(newEmbed15)
                }
            }
        }else if(cmd === 'pause'){
            server_queue.connection.dispatcher.pause()
            message.channel.send(newEmbed18)
        }else if(cmd === 'resume'){
            server_queue.connection.dispatcher.resume()
            message.channel.send(newEmbed19)
        }else if(cmd === 'forceskip'){
            if(!server_queue){
                message.channel.send(newEmbed10)
            }else{
                const newEmbed24 = new Discord.MessageEmbed()
                .setColor("#FF0000")
                .setDescription('You need to have the `MANAGE_CHANNELS` permission to force skip songs')
                message.channel.send(newEmbed24)

                const permissions = voice_channel.permissionsFor(message.client.user);
                if(!permissions.has('MANAGE_CHANNELS')) return message.channel.send(newEmbed24)
                    
                message.channel.send(newEmbed23)
                skip_song(message, server_queue);
            }
        }else if(cmd === 'forcestop'){
            if(!server_queue){
                message.channel.send(newEmbed10)
            }else{
                const newEmbed24 = new Discord.MessageEmbed()
                .setColor("#FF0000")
                .setDescription('You need to have the `MANAGE_CHANNELS` permission to use this command')

                const permissions = voice_channel.permissionsFor(message.client.user);
                if(!permissions.has('MANAGE_CHANNELS')) return message.channel.send(newEmbed24)

                message.channel.send(newEmbed13)
                stop_song(message, server_queue);
            }
        }
    }
    
}

const video_player = async (guild, song, client) => {
    const song_queue = queue.get(guild.id);

    if (!song) {
        queue.delete(guild.id);
        return;
    }

    const stream = ytdl(song.url, { filter: 'audio' });
    song_queue.connection.play(stream, { seek: 0, volume: 0.5 })
    .on('finish', () => {
        song_queue.songs.shift();
        video_player(guild, song_queue.songs[0]);
    });

    const newEmbed20 = new Discord.MessageEmbed()
    .setColor("#FFFFFF")
    .setThumbnail(song.thumbnail)
    .setDescription(`<a:musicbeat:835354164782694440> Now playing **${song.title}**\n\nIf you enjoy using A Better Music Bot, please vote for our bot on [top.gg](https://top.gg/bot/832063705021284362/vote) to help keep our service free`)
    .setFooter(`Requested by ${song.request}`)
    await song_queue.text_channel.send(newEmbed20)

    client.on('voiceStateUpdate', (oldState, newState) => {

        if (oldState.channelID !==  oldState.guild.me.voice.channelID || newState.channel)
          return;
      
        if (!oldState.channel.members.size - 1){
          setTimeout(async () => { 
            if (!oldState.channel.members.size - 1) 
               oldState.channel.leave();
               await queue.delete(guild.id);
           }, 300000);
        }
      });
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
    server_queue.voice_channel.leave()
}