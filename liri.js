//create variables to store keys and require files
require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//set arguments to take in parameters
var action = process.argv[2];
var parameter = process.argv[3];

//create a switch-case function to call the following commands: 
function switchCase() {
switch (action) {
    case "concert-this":
      bandsInTown(parameter);                   
      break;                          

    case "spotify-this-song":
      spotifySong(parameter);
      break;

    case "movie-this":
      movieInfo(parameter);
      break;

    case "do-what-it-says":
      getRandom();
      break;

    default:                            
      postIt("Invalid");
      break;
  }
};

//SEARCH FOR A BAND
function bandsInTown(){
if (action === "concert-this") {
    var movieName="";
	    for (var i = 3; i < process.argv.length; i++) {
            movieName+=process.argv[i];
	    }
    console.log(movieName);
}
else {
	movieName = parameter;
}
}

//SEARCH FOR A SONG VIA SPOTIFY
function spotifySong(parameter) {
var searchSong;
  if (parameter === undefined) {
    searchSong = "The Sign: Ace of Base";
  } 
  else {
    searchSong = parameter;
  }

spotify.search({
    type: 'track',
    query: searchSong
}, function(error, data) {
    if (error) {
      postIt('Error occurred: ' + error);
      return;
    } 
    else {
      postIt("Artist: " + data.tracks.items[0].artists[0].name);
      postIt("Song: " + data.tracks.items[0].name);
      postIt("Preview: " + data.tracks.items[3].preview_url);
      postIt("Album: " + data.tracks.items[0].album.name);
    }
  });
};

// SEARCH FOR A MOVIE VIA OMDB
function movieInfo(parameter) {
var findMovie;
if (parameter === undefined) {
    findMovie = "Mr. Nobody";
} 
else {
    findMovie = parameter;
};

var queryUrl = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";
  
request(queryUrl, function(err, res, body) {
    var bodyOf = JSON.parse(body);
    if (!err && res.statusCode === 200) {
      postIt("Title: " + bodyOf.Title);
      postIt("Release Year: " + bodyOf.Year);
      postIt("IMDB Rating: " + bodyOf.imdbRating);
      postIt("Rotten Tomatoes Rating: " + bodyOf.Ratings[1].Value); 
      postIt("Country: " + bodyOf.Country);
      postIt("Language: " + bodyOf.Language);
      postIt("Plot: " + bodyOf.Plot);
      postIt("Actors: " + bodyOf.Actors);
    }
  });
};

//get info from the random.txt file
function getRandom() {
fs.readFile('random.txt', "utf8", function(error, data){

    if (error) {
        return postIt(error);
    }

    //use the 'split' function to be able to read the .txt file
    var dataArr = data.split(",");
    
    if (dataArr[0] === "spotify-this-song") {
      var songcheck = dataArr[1].trim();
      spotifySong(songcheck);
    } 
    else if (dataArr[0] === "concert-this") { 
      if (dataArr[1].charAt(1) === "'") {
      	var dLength = dataArr[1].length - 1;
      	var data = dataArr[1].substring(2,dLength);
      	console.log(data);
      	bandsInTown(data);
      }
      else {
	      var bandName = dataArr[1].trim();
	      console.log(bandName);
	      bandsInTown(bandName);
	  }
    } 
    else if(dataArr[0] === "movie-this") {
      var movie_name = dataArr[1].trim();
      movieInfo(movie_name);
    }    
    });
};

switchCase();