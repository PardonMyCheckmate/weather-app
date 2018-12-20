console.log("Starting geocode");

const request = require("request");
require('dotenv').load(); //for retrieving apikey from .env that's in .gitignore


var geocodeAddress = (address, callback) => {
  var encodedAddress = encodeURIComponent(address); //Encodes the typed in adress i.e. spaces -> %20
  request({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.googleWeatherAPIkey}`,
    json: true //If true then it parses the json into a JS object
  },
  /*
    Body = body of http request, can be html or json example.
    Response is statuscode, the full body, the header (http protocol), request (shows protocol, host, port), our own header (we specified it was json above)
    Error: if url doesnt exist, no internet connection
  */(error, response, body) => { //Callback when http request returns
    if (error){ //System errors eg no connection
      callback("unable to connect to the Google servers.");
    } else if (body.status === "ZERO_RESULTS") { //If address aint found
      callback("Address couldn't be found, did you type in correctly?"); //Here we don't have to specify results cause errorMessage is specified first so it knows it's that
    } else if (body.status === "OK") {
      callback(undefined, { //We use undefined cause callback returns both errorMessage and result and errorMessage is the first parameter therefore we must return undefined ourselves
        address: body.results[0].formatted_address,
        latitude: body.results[0].geometry.location.lat,
        longitude: body.results[0].geometry.location.lng
      } );
    }
  });
}

module.exports = {
  geocodeAddress
};
