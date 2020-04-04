const placeRepository = require('../repository/PlaceRepository');
const recommendPlace = require('../utils/RecommenType');
const Err = require('../utils/ErrorCode');
const BaseResponse = require('../utils/BaseResponse');

var placeService = {};
module.exports = placeService;

/**
 * Query by city province
 */
placeService.queryByCityProvince = (query, pagetoken, callback) => {

    placeRepository.queryByCityProvince(query, pagetoken, (result) => {
        callback(result);
    })

}

/***
 * Near by search for location
 */
placeService.nearBySearch = (location, indexOfQuery, pagetoken, callback) => {
    
    var queryType = recommendPlace.queryString[indexOfQuery].key;

    if (recommendPlace.queryString[indexOfQuery].cal_req == 1) {
        placeRepository.nearBySearchQuery(location, queryType, pagetoken, (result) => {
            callback(result);
        })
    } else {
        placeRepository.nearBySearch(location, queryType, pagetoken, (result) => {
            callback(result);
        })
    }
    
}

/**
 * Get list nearby search around location 
 *      1, restaurant
 *      2, hotel
 *      3, attraction
 */
placeService.getListNearBySearch = (location, callback) =>{

    var queryIndex = [
        { "index" : recommendPlace.queryIndex.hotel, "title" : "Khách sạn lân cận" },
        { "index" : recommendPlace.queryIndex.restaurant, "title" : "Nhà Hàng lân cận" },
        { "index" : recommendPlace.queryIndex.attractions, "title" : "Địa danh" }
    ];

    var data = [];

    queryIndex.forEach(item => {

        placeService.nearBySearch(location, item.index, "", (result) => {
            var obj = {};
            obj.type = item.index;
            obj.title = item.title;
            obj.location = location;
            obj.places = [];

            for (var i = 0; i < 6; i++) {
                if(result.results[i]) obj.places.push(result.results[i]);
            }
            data.push(obj);
            if (data.length == queryIndex.length) 
                callback(BaseResponse(
                    Err.RESULT_OK.status,
                    data,
                    false
                ));
        });
    

    });

}


/***
 * get direction
 */
placeService.getDirection = (origin, destination, travel_mode, callback) => {
    console.log("direction");
    placeRepository.getDirection(origin, destination, travel_mode, (result) => {
        callback(result);
    })

}