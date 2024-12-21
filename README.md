# A Better Music Bot

**A Better Music Bot** was a Discord bot designed to enhance the music experience for its users. Originally operational in 2021, it has been discontinued and is now being archived as an open-source project. This bot offered a variety of music and utility commands to make music playback seamless and enjoyable for Discord communities.

## Features

### Music Commands
- **`m!play`**: Plays a song using a keyword or a YouTube/Spotify link.  
  **Usage**: `m!play [keyword or link]`  
  **Aliases**: `p`
  
- **`m!skip`**: Initiates a vote to skip the current song if 3 or more users are in the voice channel.  
  **Note**: Requires 75% of users in the channel to agree by reacting with ✅.

- **`m!forceskip`**: Skips the current song without requiring a vote.  
  **Note**: Requires `MANAGE_CHANNELS` permission.

- **`m!stop`**: Initiates a vote to stop the music and leave the voice channel if 3 or more users are present.  
  **Note**: Requires 75% approval.

- **`m!forcestop`**: Stops the music and leaves the voice channel without a vote.  
  **Note**: Requires `MANAGE_CHANNELS` permission.

- **`m!join`**: Joins the user's current voice channel.

- **`m!leave`**: Leaves the voice channel.

- **`m!nowplaying`**: Displays the current song and the next in the queue.

- **`m!pause`**: Pauses the current song.

- **`m!resume`**: Resumes the paused song.  

### Utility Commands
- **`m!invite`**: Provides an invite link to add the bot to other servers.

- **`m!support`**: Links to the bot's support server.

- **`m!vote`**: Provides a link to the bot's top.gg page.

- **`m!ping`**: Displays the bot's server latency.

## Voting Mechanism
If 3 or more users are in a voice channel, vote-based commands (`m!skip` or `m!stop`) require 75% agreement from the users in the channel. For example:
- If 3 users are present, at least 2 must agree (3 × 0.75 = 2.25 → rounded to 2).
- Bypass voting with `m!forceskip` or `m!forcestop`.

## Archival Status
This project is no longer actively maintained and is being archived as of 2024. It is now available as an open-source resource for developers. 
