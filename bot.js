var Twit = require('twit');
var TwitterBot = require('node-twitterbot').TwitterBot;

var Bot = new TwitterBot({
    consumer_key: process.env.BOT_CONSUMER_KEY,
    consumer_secret: process.env.BOT_CONSUMER_SECRET,
    access_token: process.env.BOT_ACCESS_TOKEN,
    access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET
});


function upload_image(){
    var image_path = 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Thomisidae_feeding_Junonia_almana_on_Acmella_ciliata-Kadavoor-2015-08-21-001.jpg',
        b64content = fs.readFileSync(image_path, { encoding: 'base64' });

    Bot.post('media/upload', { media_data: b64content }, function (err, data, response) {
        if (err){
            console.log('ERROR:');
            console.log(err);
        }
        else {
            Bot.post('statuses/update', {
                    media_ids: new Array(data.media_id_string)
                }
            );
        }
    });
}

upload_image();


// var phraseArray = [ "hello darkness",
//     "my old friend",
//     "chirp chirp",
//     "so how bout that weather",
//     "indescribable",
//     "delete this neffew",
//     "itz me snek",
//     "meirl",
//     "how would pants wear pants?",
//     "i aint the sharpest tool in the shed" ];
//
// function chooseRandom(myArray) {
//     return myArray[Math.floor(Math.random() * myArray.length)];
// }
//
// var phrase = chooseRandom(phraseArray) + ", " + chooseRandom(phraseArray);
// Bot.tweet(phrase);