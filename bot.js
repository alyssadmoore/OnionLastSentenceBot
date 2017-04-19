var Twit = require('twit');
var TwitterBot = require('node-twitterbot').TwitterBot;
var fs = require('fs');
var path = require('path');
var config = require(path.join(__dirname, 'config.js'));
var request = require('request');
var cheerio = require('cheerio');
var base = "http://www.theonion.com";


// Retrieve a new link from the front page of www.theonion.com
function get_link(callback){
    var final;
    request(base, function(err, resp, body){
        if (!err){
            var $ = cheerio.load(body);

            // Gets featured article link
            var featured_article = $("figure.thumb a");
            console.log(featured_article);
            var featured_link = featured_article[0]['attribs']['href'];
            if (featured_link.includes("/article/")){
                final = base + featured_link
            }
        }
        callback(final)
    })
}


// From the above link, parse html to grab title and last sentence of article,
// then divide in 140 character increments so each part is tweeted separately
function scrape(link, callback){
    var sentence_list = [];
    request(link, function(err, resp, body){
        if (!err){
            var $ = cheerio.load(body);

            // Collecting article title, don't need to do anything else to it
            var title = $(".content-header").text();

            // Collecting article text
            var text = ($(".content-text")).text();

            // Collecting from 2nd to last period to end of article
            // Unfortunately it doesn't account for "St.", so far the only flaw so I'm going to leave it be
            var regex = new RegExp("[^\.!?]+\.[^\.]+$");
            var match = regex.exec(text)[0];
            var formatted_text;

            // If the previous sentence had a close quote after the period, we must remove that and the space after it
            if (match.includes("” ")){
                formatted_text = match.replace("” ", "");
            } else {
                formatted_text = match
            }

            // Add colon and space at end of title so title & text are visually separated
            var final_text = formatted_text.trim();
            var final_title = title.trim() + ": ";
            var final_sentence = final_title + final_text;

            // If the total length is over 140 characters, we must divide them into multiple tweets
            if (final_sentence.length > 140){
                // 2 tweets
                sentence_list.push(final_sentence.substring(0, 140));
                var check = final_sentence.substring(140);
                if (check.length > 140){
                    // 4 tweets, the max (probably won't need to ever get further than this, if that happens the tweet just won't go out)
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
            callback(sentence_list)
        } else {
            console.log(err)
        }
    });
}


// Tweet whatever string was passed to it
function tweet(item){
    var T = new TwitterBot(config);
    T.tweet(item);
}


// Main function: Get a link from theonion.com, pass link to scrape function to get list of strings to tweet,
// pass that list into tweet function in forEach fashion so each item is tweeted separately (up to 4 tweets at a time)
function main(){
    get_link(function(link){
        scrape(link, function(tweets){
            tweets.forEach(tweet)
        })
    });
}

main();