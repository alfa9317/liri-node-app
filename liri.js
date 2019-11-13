require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var action = process.argv[2];
var nodeArgs = process.argv.slice(3);

switch (action) {
    case "movie-this":
        movieInfo();
        break;
    
    case "concert-this":
        concertsInfo();
        break;
    
    case "spotify-this-song":
        spotifyInfo();
        break;
    
    case "do-what-it-says":
        readInfo();
        break;
    }

function movieInfo(){
    if(nodeArgs[0] === undefined){
        console.log("Necesitas escribir una película")
    }else{
        
        var movieName = nodeArgs.join("+")
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey="+process.env.OMDB_APIKEY;
        console.log(queryUrl);

        axios.get(queryUrl).then(
            function(response) {
              console.log(`\nTitle: ${response.data.Title}
              \nRelease Year: ${response.data.Year}
              \nIMDB Rating: ${response.data.imdbRating}
              \nRotten Tomatoes Rating: ${response.data.Ratings[1].Value}
              \nProduction Country: ${response.data.Country}
              \nLanguage: ${response.data.Language}
              \nPlot: ${response.data.Plot}
              \nActors: ${response.data.Actors}\n`);
            })
            .catch(function(error) {
              if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
              } else if (error.request) {
                console.log(error.request);
              } else {
                console.log("Error", error.message);
              }
              console.log(error.config);
            });
    }
    
}

function concertsInfo(){
    if(nodeArgs[0] === undefined){
        console.log("Necesitas escribir una cancion")
    }else{
        var artistName = nodeArgs.join("+");
        var queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id="+process.env.BANDSINTOWN_APIKEY;
        console.log(queryUrl);

        axios.get(queryUrl).then(
            function(response) {
                for(var i = 0;i<response.data.length;i++){
                    console.log("\nName of the venue: "+ JSON.stringify(response.data[i].venue.name));
                    console.log("Venue location: "+JSON.stringify(response.data[i].venue.city)+", "+JSON.stringify(response.data[i].venue.country));
                    var eventDate = JSON.stringify(response.data[i].datetime).split('"');
                    console.log("Date of the event ('MM/DD/YYYY'): "+moment(eventDate[1]).format('MM/DD/YYYY')+"\n");
                }
            })
            .catch(function(error) {
              if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
              } else if (error.request) {
                console.log(error.request);
              } else {
                console.log("Error", error.message);
              }
              console.log(error.config);
            });
    }
}

function spotifyInfo(){
    if(nodeArgs[0] === undefined){
        console.log("Necesitas escribir una artista o banda")
    }else{
        var songName = nodeArgs.join("+");
    }
    spotify
  .search({ type: 'track', query: songName })
  .then(function(response) {
    console.log(`\nArtist: ${response.tracks.items[0].artists[0].name}`);
    console.log(`Song name: ${response.tracks.items[0].name}`);
    console.log(`Álbum: ${response.tracks.items[0].album.name}`);
    console.log(`Preview link to the song: ${response.tracks.items[0].external_urls.spotify}\n`);
  })
  .catch(function(err) {
    console.log(err);
  });
};

function readInfo(){
    fs.readFile("random.txt", "utf8", function(err, data) {

        if (err) {
          return console.log(err);
        }
        data = data.split(",");
        action = data[0];
        nodeArgs = data[1].split(" ");
    
        switch (action) {
            case "movie-this":
                movieInfo();
                break;
            
            case "concert-this":
                concertsInfo();
                break;
            
            case "spotify-this-song":
                
                spotifyInfo();
                break;
        }
    });
}