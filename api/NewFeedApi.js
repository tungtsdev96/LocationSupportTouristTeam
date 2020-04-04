var express = require('express');
var router = express.Router();
var NewFeedService = require('../service/NewFeedService');
var VerifyToken = require('../firebase/TokenVerify');
var Err = require('../utils/ErrorCode');

router.get('/api/newfeed/recommend', (req, res, next) => {

    var {location} = req.query;
    var {queryCity} = req.query;
    var {pagetoken} = req.query;
    var {placetypes} = req.query;

    console.log(placetypes);

    NewFeedService.getRecommendPlace(placetypes, location, queryCity, pagetoken, (data) => {
        res.json(data);
    })
})

module.exports = router;