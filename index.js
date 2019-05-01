//misc declarations
const Commando = require('discord.js-commando');
const fs = require('fs');
const ytdl = require('ytdl-core');
const LineByLineReader = require('line-by-line');
const bot = new Commando.Client();
const request = require("request");
var v = 0.1; //volume variable, bot is really loud if set above 0.1
global.playing = false; //boolean for if bot is already playing music.
global.playCommand = false; //boolean for if bot is playing a url (used in user made playlists)

//discord declarations
const TOKEN = ''; //bot token
const ID = ;  //your client ID
const BINGO_CHANNEL = ;//discord channel for bingo commands
const MUSIC_CHANNEL = ;//discord channel for music commands
const NUMBER_CHANNEL = ;//discord channel for number commands
const NUMBER_ROLE = '<@&>';
const NUMBER_ROLE_ID = ;
/*
Delete the 'if(message.channel.id !=...' lines inside bot.on commands if you would like these to be run in any channel
And also comment or delete those constants too since they'll be useless
Not recommended to run in all channels since it's a crap bot and will probably be very spammy if not restricted to single channels
*/

//folder declarations
const MUSIC_FOLDER = ''; //folder where music is stored (no / at the end)
const FAV_FOLDER = ''; //folder for favorites to go
const BINGO = '' //folder for bingo files

//command registration for !leave and !join
bot.registry.registerGroup('music', 'Music');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + '/commands');


//Array shuffle function
function shuffle(a) {
    for (let n = a.length - 1; n > 0; n--) {
        const j = Math.floor(Math.random() * (n + 1));
        [a[n], a[j]] = [a[j], a[n]];
    }
    return a;
}

//creates a file for storing liked tracks
if(!(fs.existsSync('likes.txt'))){
    var likes = fs.createWriteStream('likes.txt');
    likes.once('open', function(fd) {
        likes.write('Storage information for likes\n');
        likes.write('3\n');
        likes.end();
    });
} else {
    console.log('Likes file already exists, skipping creation');
}

//write the default mvm bingo file
if(!(fs.existsSync('bingoItems.txt'))){
    var bingo = fs.createWriteStream('bingoItems.txt');
    bingo.once('open', function(fd) {
        bingo.write('Less than 5 tour pyro - noob pyro\n');
        bingo.write('Pyro with no gas - no gas\n');
        bingo.write('High tour leaves before joining - high tour ditch\n');
        bingo.write('F4 is broken - broken f4\n');
        bingo.write('Heavy shooting uber meds - shoot meds\n');
        bingo.write('Heavy using natasha - natasha\n');
        bingo.write('Idiot high tour - dumb high tour\n');
        bingo.write('Kick scout - kick scout\n');
        bingo.write('No upgrades - no upgrades\n');
        bingo.write('Pyro using airblast badly - airblast pyro\n');
        bingo.write('Pyro keeping bots in spawn - spawnblock\n');
        bingo.write('Heavy using rage with crits - crit rage\n');
        bingo.write('All 100+ tours - high tours\n');
        bingo.write('4 or more <10 tours - low tours\n');
        bingo.write('Actual noob - noob\n');
        bingo.write('Stuck in gate - trapped player\n');
        bingo.write('Tele\'d into grinder - grinder kill\n');
        bingo.write('Noob scout loses more than $100 - huge loss\n');
        bingo.write('Non-Americian server - foreign server\n');
        bingo.write('Russian - russian\n');
        bingo.write('1,000+ tour - 1000 tour\n');
        bingo.write('Hacker - hacks\n');
        bingo.write('Actually kicking someone - kicking\n');
        bingo.write('TvM - tvm\n');
        bingo.write('Soldier not buying reload speed - reload speed\n');
        bingo.write('Spy! - spy\n');
        bingo.write('6th person times out before join - time out\n');
        bingo.end();
    });
} else {
    console.log('Bingo file already exists, skipping creation');//log if file is already there
}

//create arrays for commands vs descriptions
fs.readFile('bingoItems.txt', function(err, data) {
    if(err) throw err;
    var bingoItems = data.toString().split("\n");//magic
    global.bingoDesc = [];//declare desc (anything before the - )
    global.bingoCommand = [];//declare commands (anything after the - )
    for(i = 0; i < (bingoItems.length-1); i++) {
        var space = bingoItems[i].indexOf(' - ');
        bingoDesc[i] = (bingoItems[i].substr(0, space));
        bingoCommand[i] = bingoItems[i].substr(space+3);
    }
    //console.log(bingoDesc); //left in for future debug
});

//Fancy number tagger
bot.on("message", async message => {

    if(message.channel.id != NUMBER_CHANNEL) return;//check for fancy number channel
    if(message.author.bot) return;//deny bots from taking over the world

    const args = message.content.slice(0).trim().split(/ +/g);//slice n dice commands
    const command = args.shift().toLowerCase();
    if(command.substr(0,27) == 'https://steamcommunity.com/'){
        request(
            { uri: command },
            function(error, response, body) {
                var steamLinkData = body.toString().split("actualmediactn");
                //console.log(steamLinkData[1].substr(0, 200));
                var steamLinkTwo = steamLinkData[1].substr(0, 200).toString().split("/\"");
                var startOfHttp = steamLinkTwo[0].indexOf('http');
                var actualImgLink = steamLinkTwo[0].substr(startOfHttp) + '/';

                message.delete();
                message.reply(NUMBER_ROLE + command, {embed: {

                    "image": {"url": actualImgLink}
                }});
            }
        )
    } 

    if (command == 'giverole'){
        let myRole = message.guild.roles.get("553319538666504204");
        if(message.member.roles.has(myRole.id)){
            message.reply( 'you already have this role NERD!')
        } else {
            message.member.addRole(myRole.id).catch(console.error);
            message.reply(' added you to the \"I fap to fancy numbers\" role.')
        }
    }
    if(command == 'removerole'){
        let myRole = message.guild.roles.get("553319538666504204");
        if(message.member.roles.has(myRole.id)){
            message.member.removeRole(myRole.id).catch(console.error);
            message.reply(' removed you from the \"I fap to fancy numbers\" role.')
        } else {
            message.reply(' you don\'t have this role!')
        }
        
    }

});




//Bingo commands
bot.on("message", async message => {

    if(message.channel.id != BINGO_CHANNEL) return;//check for bingo channel
    if(message.author.bot) return;//deny bots from taking over the world

    const args = message.content.slice(0).trim().split(/ +/g);//slice n dice commands (must start with bingo)
    const command = args.shift().toLowerCase();
    if(command != 'bingo') return;
    console.log('Bingo command');
    console.log(args);


    //create a card
    if (args[0] == 'create') {
        var userFile = message.author.id.toString() + '.txt';//unique file for each person
        var bingoCard = bingoDesc; //create a card array
        shuffle(bingoCard); //shuffle ze card
        if(!(fs.existsSync(userFile))){
            var bingo = fs.createWriteStream(userFile);
            bingo.once('open', function(fd) {
                for(i = 0; i < 25; i++) { //only write 24 of the options (5x5 but free space)
                    if ( i == 12) {
                        bingo.write('Free Space\n');
                    } else {
                        bingo.write(bingoCard[i] + '\n');
                    }
                }
                
            })
            message.reply('Bingo card created. View with \"Bingo card\".')
        } else {
            console.log(userFile + ' already exists')//deny creating a card if one exists
            message.reply('you already have a bingo card, try \"bingo reset\" for a new card');
        }
    }


    var spaceLength = 17; //how big each card space will be wide

    function evenSpace(i) { //function for determining amount of spaces on each side of words
        var spaces = ' ';
        if (i == spaceLength) {
            spaces = ''
        } else {
            while(i<spaceLength) {
                spaces += ' ';
                i += 2;
            }
        }
        return spaces;
    }

    //display card
    if (args[0] == 'card') {
        var userFile = message.author.id.toString() + '.txt';//unique file for each person
        if(fs.existsSync(userFile)){//check for a file
            var s = '|'; // s for spacing
            fs.readFile(userFile, function(err, data) {
                if(err) throw err;
                var firstTime = true;
                var userCard = data.toString().split("\n");
                var addRow = false;
                var rowTwo = [];
                var cardString = '----------------------------------------------------------------------------------------------------\n';
                for(i = 0; i < 25; i++) { //format the card to discord chat, please don't ask, I don't even know
                    if(i != 4 && i != 9 && i != 14 && i != 19 && i != 24) { // all non-end spaces
                        if (userCard[i].length <= spaceLength) {
                            cardString += (evenSpace(userCard[i].length) + userCard[i] + evenSpace(userCard[i].length) + s);
                        } else {
                            rowTwo[i] = userCard[i].substr(userCard[i].length/2);
                            userCard[i] = userCard[i].substr(0, userCard[i].length/2);
                            cardString += (evenSpace(userCard[i].length) + userCard[i] + evenSpace(userCard[i].length) + s);
                            addRow = true;
                        }
                    } else { //end spaces
                        if (userCard[i].length <= spaceLength) {
                            cardString += (evenSpace(userCard[i].length) + userCard[i] + evenSpace(userCard[i].length) + s + '\n');
                        } else {
                            rowTwo[i] = userCard[i].substr(userCard[i].length/2);
                            userCard[i] = userCard[i].substr(0, userCard[i].length/2);
                            cardString += (evenSpace(userCard[i].length) + userCard[i] + evenSpace(userCard[i].length) + s + '\n');
                            addRow = true;
                        }


                        if (addRow) { //adding 2nd row
                            for(a = 4; a >= 0; a--) {
                                if (!rowTwo[i-a]) {
                                    rowTwo[i-a] = evenSpace(2);
                                }
                                cardString += (evenSpace(rowTwo[i-a].length) + rowTwo[i-a] + evenSpace(rowTwo[i-a].length) + s );
                            }
                            cardString += '\n'
                        }
                        cardString += '----------------------------------------------------------------------------------------------------\n';
                    }

                }
                message.reply('\n' + '\`' + cardString + '\`');
               console.log(cardString);
            });
        } else {//deny if file doesn't exist
            message.reply(' you don\'t have a card yet, create one with \"bingo create\" ');
        }
    }




});


//Music commands
bot.on("message", async message => {

    if(message.channel.id != MUSIC_CHANNEL) return;//check for music channel
    if(message.author.bot) return;//deny bots from taking over the world

    const args = message.content.slice(0).trim().split(/ +/g);//grab our command and args and log em
    const command = args.shift().toLowerCase();
    console.log(command);
    console.log(args);


/*========================================================================================
Playlist stuff
==========================================================================================*/
    function playlistStart() { //function this to run in other commands
        global.i = -1; //declare incriment (starts at -1 so a song is not skipped)
        playing = true //bot will now be playing until playlist is finished, lets the bot know it is
        var fs = require('fs'); 
        global.files = fs.readdirSync(MUSIC_FOLDER); //Playlist array
        shuffle(files); //Shuffle array
        console.log(files); //Mostly for debug purposes
        console.log(files[2]);   
    }  

    function playList() { //function to be run on song end and first time 'Start' is run
            i++;
            if (i<files.length && message.guild.voiceConnection) { //checks for finish
                global.song = MUSIC_FOLDER + '/';
                song += files[i];
                var space = files[i].indexOf(' -');
                var band = files[i].substr(0, space)

                console.log('started song = ' + song); //display which song is supposed to play to console and chat
                message.channel.send('Now playing ' + files[i])
                    .then(msg => {
                        msg.delete(100000)  //auto delete now playing messages, add a song.length if you know what it is
                    })
                    .catch();
                bot.user.setActivity(band); //set Playing band (follows format "band name - song")
                global.dispatcher = message.guild.voiceConnection.playFile(song);    //play song
                
                dispatcher.setVolume(v);


                dispatcher.on("end", end => {   //end function, will run when song playing ends
                    dispatcher.end();   //closes voice sender so next song can play
                    if (playing == true) { //checks to see if another command ended the start function
                        playList(); //runs playlist again
                    } else {
                        message.channel.send('Ending playlist'); //sends a message and does not run the next song
                    }
                });
            } else {
                console.log('finished playlist');
                message.channel.send('Finished playlist');
                playing = false;
            }
        }

    //start command MUST be connected (the bot) and not already playing something
    if(!playing && message.guild.voiceConnection && command == 'start')
    {
        playlistStart();
        message.channel.send('Playlist created with ' + files.length + ' songs. Aprox. runtime: ' + (4*files.length/60).toFixed(2) + ' hours');
        playList();
    }
/*========================================================================================
End playlist stuff
==========================================================================================*/


    //Next? - displays next 5 songs in discord chat
    if(message.guild.voiceConnection && command == 'next?'){
        message.channel.send('The next 5 songs are: ' + files[i+1]);
        message.channel.send(files[i+2]);
        message.channel.send(files[i+3]);
        message.channel.send(files[i+4]);
        message.channel.send(files[i+5]);
    }

    //volume? - displays current volume
    if(message.guild.voiceConnection && command == 'volume?') {
        message.channel.send('Volume is set to: ' + v);
    }
    

    //volume - control bot volume
    if (message.guild.voiceConnection && command == 'volume') 
        //var MAX_VOLUME = 0.25;//max volume, over .5 is very loud, .25 should be fine enough for all users and is only 2.5x louder than default
        //var MIN_VOLUME = 0;//min volume, not recommended to change as even .01 is pretty loud
        if (args[0]<=0.25 && args[0] > 0){
            v = args[0];
            message.channel.send('Set volume to ' + v);
            console.log('Changing volume to ' + v);
            dispatcher.setVolume(v);
        } else if (args[0]>.25) {
            message.reply('We dont allow ear rape here, please pick a volume below ' + .25);
        } else {
            message.reply('DUMBASS ALERT!!! VOLUME CAN NOT BE SET BELOW ' + 0 + ' IDIOT'); //change message if you change MIN_VOLUME or you will be the dumbass
        }

    //Skip - skips current song, optional skip next few songs
    if(playing && message.guild.voiceConnection && command == 'skip'){
        if (args[0] == null){
            dispatcher.end();
        } else {
            i = i+args[0]-1; //adds the amount of songs to skip to i, then takes one away since playlist() will auto incriment
            dispatcher.end();
        }
    }


    //Replay - play the last song
    if(message.guild.voiceConnection && command == 'replay'){
        i = i-2;//set song two songs back
        dispatcher.end();//will end song and add 1 to I thus playing the last song (i-1)
    }


    //Current - displays current song
    if(message.guild.voiceConnection && command == 'current'){
        message.channel.send('The current song is: ' + files[i]);
    }
    

    //Last - displays previous song
    if(message.guild.voiceConnection && command == 'last?') {
        if(i>0) { //checks to make sure it's not the first song playing
            message.channel.send('The previous song played was: ' + files[i-1])
        } else {
            message.channel.send('There was no song played before this one')
        }
    }

/*========================================================================================
Play request stuff
==========================================================================================*/

    function createUserPL(){
        global.userPlaylist = []; //declare unkown array size for storing url (or clear it)
        global.userPLCounter = -1; // set counter to -1 so userPL can always start with ++ (or reset it)
    }

    function addUserPL(url){
        l = userPlaylist.length; //find length of array
        userPlaylist[l] = url; //set new url to end of array
        message.delete();//delete youtube link to keep chat clutter free
        message.channel.send('Added your video to the queue ' + message.author + ' in position ' + (l+1) + '. Current playlist position is: ' + (userPLCounter+1)); //+ ', ' + (l-userPLCounter+1) + ' songs until yours.' ); //reply with when song will be played
    }

    async function userPL(){
        l = userPlaylist.length;
        userPLCounter++;
        if(userPLCounter < l) {
            var url = userPlaylist[userPLCounter]
            //probably magic
            let info = await ytdl.getInfo(url);
            let stream = ytdl(url, {filter: 'audioonly', highWaterMark: 1024 * 1024 * 32 })
                .on("error", error => {
                    console.error(error);
                    message.channel.send("Error Occurred during playback. Try again later.");
                })
            global.dispatcher = message.guild.voiceConnection.playStream(stream);
            dispatcher.setVolume(v);
            console.log('Playing : ' + info.title);
            message.channel.send('Now Playing: ' + info.title);
            dispatcher.on("end", e => {
                message.channel.send('Finished Playing: ' + info.title);
                userPL();
            })
        } else { //when user playlist has reached end of array run local disk playlist
            playing = false;
            playCommand = false;
            playlistStart();
            playList();
        }
    }

    //Play - plays a youtube url
    if(message.guild.voiceConnection && command == 'play'){
        if (args[0] != null && args[0].substring(0,4) == 'http') {  //checks for url in message

            if (playing == true) {  //checks to see if something else is playing.
                if (playCommand == false) { //checks to see if that thing playing was a previous play command.
                    console.log('Running first time play command from local playlist')// debug statement
                    playing = false;        //if playlist was running, cancel it and set playing to false (redundant i know)
                    dispatcher.end();       //turn song off
                    createUserPL();         //create our playlist array or reset it to blank values
                    addUserPL(args[0])      //add requested url to first position
                    playing = true;         //set tracking variables
                    playCommand = true;
                    userPL();               //run the actual queue/play the song
                } else {                    //if play command was running, add song to queue
                    console.log('Running add queue for already playing')// debug statement
                    addUserPL(args[0]);     //add song to queue
                }
            } else { //if this is the first command run when bot is started
                if (playCommand == false) { //checks to see if that thing playing was a previous play command.
                    console.log('Running first time play command as the first command')// debug statement
                    createUserPL();         //create our playlist array or reset it to blank values
                    addUserPL(args[0])      //add requested url to first position
                    playing = true;         //set tracking variables
                    playCommand = true;
                    userPL();               //run the actual queue/play the song
                } else {                    //if play command was running, add song to queue
                    console.log('This should never print hopefully') // debug statement
                    addUserPL(args[0]);
                }
            }
            
        } else {
            message.reply('You must provide an http url'); //deny if no http is sent
        }
    }
/*========================================================================================
End Play request stuff
==========================================================================================*/

});

console.log('Login');
bot.login(TOKEN);
bot.on('error', console.error);