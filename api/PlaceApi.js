var express = require('express');
var router = express.Router();
var PlaceService = require('../service/PlaceService');
var VerifyToken = require('../firebase/TokenVerify');

/**
 *  Query by city province
 */
router.get("/api/near-by-search/city", (req, res, next) => {

    var {query, pagetoken} = req.query;

    PlaceService.queryByCityProvince(query, pagetoken, (result) => {
        res.json(result);
    })

})

/**
 * Near by search api
 */
router.get("/api/near-by-search", (req, res, next) => {
    var {location} = req.query;
    var {type} = req.query;
    var {pagetoken} = req.query;

    PlaceService.nearBySearch(location, type, pagetoken, (result) => {
        res.json(result);
    })
})


router.get("/api/recommend-place", (req, res, next) => {
    var {location} = req.query;

    PlaceService.getListNearBySearch(location, (result) => {
        res.json(result);
    })
})

router.get("/api/get-direction", (req, res, next) => {
    var {origin, destination, travel_mode} = req.query;

    PlaceService.getDirection(origin, destination, travel_mode, (result) => {
        res.json(result);
    })

})

module.exports = router;
