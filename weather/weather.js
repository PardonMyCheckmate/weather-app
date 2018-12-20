const request = require("request");
const degrees = require("fahrenheit-to-celsius");

require('dotenv').load(); //for retrieving apikey from .env that's in .gitignore

var getWeather = (lat, lng, callback) => {
  request({
      url:`https://api.darksky.net/forecast/${process.env.forecastAPIkey}/${lat},${lng}`,
      json: true
    },(error,response,body) => {
      if (error) { //Note - could also just !error && statusCode === 200. Doesn't distinct between errors then
        callback("Unable to connect to server", undefined);
      } else if (response.statusCode === 400) {
        callback("Unable to fetch weather from darksky", undefined);
      } else if (response.statusCode === 200) {
        callback(undefined, {
          temp: degrees(body.currently.temperature),
          appTemp: degrees(body.currently.apparentTemperature)
        });

      }
    });
}


  module.exports.getWeather = getWeather;
