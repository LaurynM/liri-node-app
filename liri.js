require("dotenv").config();

var keys = require("./keys.js");
var request = require("request");
const fs = require('fs');

var command = process.argv[2];
var query = process.argv[3];

//Twitter
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var params = {screen_name: 'HelloLiri', count: 20};

//Spotify
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);







var LiriCommands = function() {
  switch(command){
  case "my-tweets":
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log("\n" + "Tweets from newest to oldest:" + "\n")
            for (var i = 0; i < tweets.length; i++){
                console.log("Tweet " + (i+1) + ":  " +tweets[i].text);
            }
        }
    });
    break;
  case "spotify-this-song":
    var song = query;
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (var i = 0; i < data.tracks.items.length; i++){
            console.log("-----Result #" + (i+1) + "-----")
            console.log("Artist(s) name: " + data.tracks.items[i].artists[0].name); //Artist(s)
            console.log("Track Title: " + data.tracks.items[i].name); //Track Title
            console.log("Preview link: " + data.tracks.items[i].preview_url); //Preview Link            
            console.log("Album Title: " + data.tracks.items[i].album.name + "\n"); // Album Title
            } 
        });
    break;
  case "movie-this":
    var movie = query;
    if (movie == undefined){
        movie = "Mr. Nobody";
    }
    request("http://www.omdbapi.com/?apikey=trilogy&t=" + movie + "&plot=short&tomatoes=true", function (error, response, body) {
        if (!error && response.statusCode === 200){
//             console.log(body);
            console.log("Movie Title: " + JSON.parse(body).Title); //  Title of the movie.
            console.log("Movie Year: " + JSON.parse(body).Year); // Year the movie came out.
            console.log("IMDb Rating: " + JSON.parse(body).Ratings[0].Value); // IMDB Rating of the movie.
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value); // Rotten Tomatoes Rating of the movie.
            console.log("Country: " + JSON.parse(body).Country); // Country where the movie was produced.
            console.log("Language(s): " + JSON.parse(body).Language); // Language of the movie.
            console.log("Synopsis: " + JSON.parse(body).Plot); // Plot of the movie.
            console.log("Actors: " + JSON.parse(body).Actors); // Actors in the movie.
        };
});
    break;
    case "do-what-it-says":
        fs.readFile("./random.txt", 'utf8', function(err, data) {
        if (err) throw err;
        var res = data.split(",");
        command = res[0];
        query = res[1];
        LiriCommands();
    });
    break;
  default:
    console.log("Please use a command. Available commands are: \n my-tweets \n spotify-this-song \n movie-this \n do-what-it-says")
};
};


LiriCommands();