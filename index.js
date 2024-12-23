const Discord = require('discord.js');
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const fs = require('fs');

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler =>{
    require(`./handlers/${handler}`)(client, Discord);
});

activities_list = [
  "m!help", 
  "m!help", 
  "join the support server, -support", 
  `music in ${client.guilds.cache.size.toLocaleString()}/100 servers!`,
  "use m!invite to add me",
  "use m!vote to support me"
  ] 

const activities_type = [
  "LISTENING", 
  "LISTENING", 
  "PLAYING", 
  "PLAYING",
  "PLAYING",
  "PLAYING"
  ]

client.once('ready', () => {
  setInterval(() => {
    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); 
    client.user.setActivity(activities_list[index], { type: activities_type[index] });
}, 3000); 
    console.log(`Music Bot has ${client.users.cache.size} users, in ${client.guilds.cache.size} servers!`);
});

setInterval(async function(){

  activities_list = [
    "m!help", 
    "m!help", 
    "join the support server, m!support", 
    `music in ${client.guilds.cache.size.toLocaleString()}/100 servers!`,
    "use m!invite to add me",
    "use m!vote to support me"
    ]
    
}, 1000);

const AutoPoster = require('topgg-autoposter')

const ap = AutoPoster(process.env.TOPGG_TOKEN, client)

setInterval(async function(){

ap.on('posted', () => {
  console.log('Posted stats to Top.gg!')
})

}, 3600000);

client.login(process.env.TOKEN);