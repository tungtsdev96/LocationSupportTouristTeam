var express = require('express');
var express = require('express');
var router = express.Router();
var TripService = require('../service/TripService');
var VerifyToken = require('../firebase/TokenVerify');
var ErrMessage = require('../utils/ErrorMessage');


/***
 * Create infor trip
 */
router.post('/api/trip/post/create-infor-trip', (req, res, next) => {
    var {tripInfor} = req.body;
    
})



 //////////////////////////////////////////////////////////////////
router.get('/api/trip/get-all-by-uid', (req, res, next) => {
    var {userId} = req.query;
    TripService.getAllTripByUserId(userId, (err, result) => {
        if (err != null) {
            res.json(ErrMessage(404, "Have an error"));
        } else {
            res.json(result);

        }
    })
})

router.post('/api/trip/post/create-trip', (req, res, next) => {
    var {tripInfor} = req.body;
    TripService.createTrip(userId, (tripInfor, result) => {
        if (err != null) {
            res.json(ErrMessage(404, "Have an error"));
        } else {
            res.json(result);

        }
    })
})

router.delete('/api/trip/delete/delete-trip', (req, res, next) => {
    var {tripId} = req.query;
    TripService.deleteTrip(tripId, (tripInfor, result) => {
        if (err != null) {
            res.json(ErrMessage(404, "Have an error"));
        } else {
            res.json(result);

        }
    })
})

router.get('/api/trip/get-infor-by-id', (req, res, next) => {
    var {tripId} = req.query;
    TripService.getDetailTripById(tripId, (tripInfor, result) => {
        if (err != null) {
            res.json(ErrMessage(404, "Have an error"));
        } else {
            res.json(result);

        }
    })
})

router.get('/api/trip/get-detail-day-of-trip',  (req, res, next) => {
    var {tripId} = req.query;
    TripService.getDetailDayOfTrip(tripId, (tripInfor, result) => {
        if (err != null) {
            res.json(ErrMessage(404, "Have an error"));
        } else {
            res.json(result);

        }
    })
})

module.exports = router;

