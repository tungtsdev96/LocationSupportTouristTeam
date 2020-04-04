const recommendPlace = require('../utils/RecommenType');
const placeService = require('./PlaceService');
const PlaceRepository = require('../repository/PlaceRepository');
const Err = require('../utils/ErrorCode');
const BaseResponse = require('../utils/BaseResponse');

var service = {};
module.exports = service;

service.getRecommendPlace = (placetypes, location, keyCity, pagetoken, callback) => {

    var ids = placetypes.split(",");

    var data = [];

    if (location) {
        // search near by
        ids.forEach(id => {

            placeService.nearBySearch(location, id, "", (result) => {
                var obj = {};
                obj.type = id;
                obj.title = recommendPlace.queryString[id].title;
                obj.location = location;
                obj.places = [];
    
                for (var i = 0; i < 6; i++) {
                    if(result.results[i]) obj.places.push(result.results[i]);
                }
                data.push(obj);
                if (data.length == ids.length) 
                    callback(BaseResponse(
                        Err.RESULT_OK.status,
                        data,
                        false
                    ));
            });
        
    
        });

    } else {
        // search in city
        ids.forEach(id => {

            var query = recommendPlace.queryString[id].key + " in " + keyCity;
            PlaceRepository.queryByCityProvince(query, pagetoken, (result) => {
                var obj = {};
                obj.type = id;
                obj.title = recommendPlace.queryString[id].title;
                obj.is_query_city = true;
                obj.query_city = query;
                obj.places = [];

                for (var i = 0; i < 6; i++) {
                    if(result.results[i]) obj.places.push(result.results[i]);
                }

                data.push(obj);
                if (data.length == ids.length) 
                    callback(BaseResponse(
                        Err.RESULT_OK.status,
                        data,
                        false
                    ));
            })

        })
    }
}