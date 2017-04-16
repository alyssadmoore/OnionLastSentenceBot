var Twit = require('twit');
var TwitterBot = require('node-twitterbot').TwitterBot;
var download = require('download');
var fs = require('fs');
var path = require('path');
var config = require(path.join(__dirname, 'config.js'));
var request = require('request');
var cheerio = require('cheerio');
var url = "http://www.theonion.com/article/couple-puts-handful-items-registry-loser-family-me-55718";
var T = new TwitterBot(config);


function scrape(){
    request(url, function(err, resp, body){
        if (!err){
            var $ = cheerio.load(body);

            // Collecting article title
            var title = $(".content-header").text();

            // Collecting article text
            var text = ($(".content-text")).text();

            // Collecting from 2nd to last period to end of article
            // Unfortunately it doesn't account for "St.", so far the only flaw so I'm going to leave it be
            var regex = new RegExp("[^\.!?]+\.[^\.]+$");
            var match = regex.exec(text)[0];
            var formatted_text;

            // If the previous sentence had a close quote, we must remove that and the space after it
            if (match.includes("” ")){
                formatted_text = match.replace("” ", "");
            } else {
                formatted_text = match
            }

            // Add period and space at end of title so title & text are visually separated
            var final_text = formatted_text.trim();
            var final_title = title.trim() + ". ";
            var final_sentence = final_title + final_text;
            var sentence_list = [];

            // If the total length is over 140 characters, we must divide them into multiple tweets
            if (final_sentence.length > 140){
                // 2 tweets
                sentence_list.push(final_sentence.substring(0, 140));
                var check = final_sentence.substring(140);
                if (check.length > 140){
                    // 4 tweets, the max (probably won't need to ever get this far)
                    sentence_list.push(check.substring(0, 140));
                    sentence_list.push(check.substring(140))
                } else {
                    // 3 tweets
                    sentence_list.push(final_sentence.substring(140))
                }
            } else {
                // 1 tweet
                sentence_list.push(final_sentence);
                sentence_list.push(final_sentence)
            }

            return sentence_list;

        }
    })
}


function tweet(item, index){
    T.tweet(item)
}

var sentences = scrape();
sentences.foreach(tweet);