const commando = require('discord.js-commando');

class LeaveCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'leave',
            group: 'music',
            memberName: 'leave', 
            description: 'Leaves voice channel.'
        });
    }

    async run(message, args) {
        if(message.guild.voiceConnection && message.member.voiceChannel){
            message.guild.voiceConnection.disconnect();
            message.channel.send('Left voice chat');
            playing = false;
            console.log("Playing variable changed to: " + playing);
        } else {
            message.reply('User and bot must be in a voice channel to use the leave command.');
        }
    
    }

}

module.exports = LeaveCommand;