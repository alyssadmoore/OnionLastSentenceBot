var Twit = require('twit');
var TwitterBot = require('node-twitterbot').TwitterBot;

var Bot = new TwitterBot({
    consumer_key: process.env.BOT_CONSUMER_KEY,
    consumer_secret: process.env.BOT_CONSUMER_SECRET,
    access_token: process.env.BOT_ACCESS_TOKEN,
    access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET
});

var phraseArray = [ "hello darkness",
    "my old friend",
    "chirp chirp",
    "so how bout that weather",
    "indescribable",
    "delete this neffew",
    "itz me snek",
    "meirl",
    "how would pants wear pants?",
    "i aint the sharpest tool in the shed" ];

function chooseRandom(myArray) {
    return myArray[Math.floor(Math.random() * myArray.length)];
}

var phrase = chooseRandom(phraseArray) + ", " + chooseRandom(phraseArray);
Bot.tweet(phrase);