const express = require("express");
const app = express();
const yargs = require("yargs");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000; //env.PORT comes from heroku but when ran local it doesn't exist so we'll just take 3k

const geocode = require("./geocode/geocode.js");
const weather = require("./weather/weather"); //we dont need js

//NOTE - I don't use yargs anymore since I've made it a client application.

//Difference between using options and command while yargs is that options gets assigned values while command is what we'll need to get done
//eg add/list etc in note-app is commands. --address (and --title, --body) is options
/*const argv = yargs
  .options({
    address: {
      demand: true,
      alias: "a",
      describe: "Enter the address",
      string: true //Has to be a string as input
    }
  })
  .help()
  .alias("help", "h") //--help is now -h
  .argv
*/

app.set('views', './views'); //Tells that view is in views.
app.set('view engine', 'ejs'); //Tells we're using ejs

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res){ //We set both to null as long as we haven't posten anything
  res.render("index", {weather: null, error: null}); //renders our index.ejs file and send the html-equivalent to the client
});

app.post("/", (req, res) => {
  //Note - we either recieve errorMessage og results.
  //If we recieve errorMessage (since that's first), we don't have to specify results but if we want results (succeeded search) we'll need to return an undefined errorMessage aswell. See geocode.js for more
  geocode.geocodeAddress(req.body.address, (errorMessage, results) => {
    if (errorMessage) {
      res.render("index", {weather: null, error: errorMessage})
    } else {
      var formattedAddress = results.address;
      weather.getWeather(results.latitude, results.longitude, (errorMessage, results) => {
        if (errorMessage) {
          res.render("index", {weather: null, error: errorMessage})
        } else {
          var weatherText = `It is ${results.temp} degrees but it feels like ${results.appTemp} at/in ${formattedAddress}`;
          console.log(weatherText);
          res.render("index",{weather:weatherText, error:null});
        }
      });
    }
  });
})
 
app.listen(port, () => {
  console.log(`Listening to ${port}`);
});
