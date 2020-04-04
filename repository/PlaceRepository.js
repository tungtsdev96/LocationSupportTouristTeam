
/**
 * Import Api caller
 */
const Apicaller = require('../utils/ApiCaller');

const HOST_GG_MAP = "https://maps.googleapis.com";
const KEY_GG_MAP = "API_KEY_HERE";

var placeReposiroty = {};
module.exports = placeReposiroty;


// [INCLUDE PLACE API]
/** import constan **/
const fields = "&fields=place_id,user_ratings_total,rating,photo,name,price_level,formatted_address";
const DEFAULT_RADIUS = 3000;

/**
 * Nearby Search requests
 */
placeReposiroty.nearBySearch = (location, type, pagetoken, callback) => {

    var endpoint = HOST_GG_MAP + "/maps/api/place/nearbysearch/json?language=vi" + fields + "&location=" + location + "&radius=" + DEFAULT_RADIUS + "&type=" + type + "&key=" + KEY_GG_MAP;
    if (pagetoken) {
        endpoint += "&pagetoken=" + pagetoken;
    }

    Apicaller.makeReq(endpoint, (err, result) => {
        callback(result);
    })

}

/**
 * Text Search requests
 * include location
 */
placeReposiroty.nearBySearchQuery = (location, query, pagetoken, callback) => {
    var endpoint = HOST_GG_MAP + "/maps/api/place/textsearch/json?language=vi" + fields + "&location=" + location + "&radius=" + DEFAULT_RADIUS + "&query=" + query + "&key=" + KEY_GG_MAP;
    endpoint = encodeURI(endpoint);
    if (pagetoken) {
        endpoint += "&pagetoken=" + pagetoken;
    }

    Apicaller.makeReq(endpoint, (err, result) => {
        callback(result);
    })
}

/***
 * Text search in city province
 */
placeReposiroty.queryByCityProvince = (query, pagetoken, callback) => {
    var endpoint = HOST_GG_MAP + "/maps/api/place/textsearch/json?language=vi" + fields + "&query=" + query + "&key=" + KEY_GG_MAP;
    endpoint = encodeURI(endpoint);
    if (pagetoken) {
        endpoint += "&pagetoken=" + pagetoken;
    }

    Apicaller.makeReq(endpoint, (err, result) => {
        callback(result);
    })
}


// [END PLACE API]

// [DIRECTION API]
/* import constant */
var url = HOST_GG_MAP + "/maps/api/directions/json?language=vi&alternatives=true";

/***
 * get path
 */
placeReposiroty.getDirection = (origin, destination, travel_mode, callback) => {

    var endpoint = url + "&origin=" + origin + "&destination=" + destination + "&key=" + KEY_GG_MAP ;

    if (travel_mode) {
        endpoint += "&mode=" + travel_mode;
    } 
    endpoint = encodeURI(endpoint);
    Apicaller.makeReq(endpoint, (err, result) => {
        callback(result);
    })

}
// [END DIRIECTION API]