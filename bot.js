var Twit = require('twit');
var TwitterBot = require('node-twitterbot').TwitterBot;

var Bot = new TwitterBot({
    consumer_key: process.env.BOT_CONSUMER_KEY,
    consumer_secret: process.env.BOT_CONSUMER_SECRET,
    access_token: process.env.BOT_ACCESS_TOKEN,
    access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET
});


function upload_image(){
    var image_path = path.join(__dirname, '/images/1.jpg'),
        b64content = fs.readFileSync(image_path, { encoding: 'base64' });

    Bot.post('media/upload', { media_data: b64content }, function (err, data, response) {
        Bot.post('statuses/update', {
                media_ids: new Array(data.media_id_string)
            }
        );
    });
}

upload_image();
