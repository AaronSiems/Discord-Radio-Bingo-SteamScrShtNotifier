const commando = require('discord.js-commando');

class JoinCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'join',
            group: 'music',
            memberName: 'join', 
            description: 'Joins voice channel player is in.'
        });
    }

    async run(message, args) {
        if(message.member.voiceChannel && !message.guild.voiceConnection){
            var voiceChannel = message.member.voiceChannel;
            voiceChannel.join()
                .then( connection => {
                    message.channel.send('Joined voice chat')
                });
        } else {
            message.reply('You must first join a voice channel.')
        }
    }

}

module.exports = JoinCommand;