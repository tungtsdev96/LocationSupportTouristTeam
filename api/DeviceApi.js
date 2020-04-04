var express = require('express');
var router = express.Router();
var deviceService = require('../service/DeviceService');
var VerifyToken = require('../firebase/TokenVerify');
var Err = require('../utils/ErrorCode');

/**
 * update device
 */
router.post("/api/device/update", VerifyToken.getToken, (req, res, next) => {
    var idToken = req.token;
    var data = req.body;
    if (!data) res.json(Err.DATA_NOT_NULL);
    else 
         VerifyToken
                 .verifyToken(idToken)
                 .then((decodeToken) => {
                    
                    data.user_id = decodeToken.user_id;
                    data.display_name = decodeToken.name;
                    deviceService.updateDevice(data, (err, result) => {
                        if (err != null) {
                           res.json(Err.DATA_CANT_NOT_BE_SAVE);
                        } else {
                            res.json(result);
                        }
                    })

                 }).catch((err) => {
                    console.log(err);
                    res.json(Err.INVALID_TOKEN);
                 })
})

 /**
  * get device by userId
  */
router.get("/api/device/get-by-user", (req, res, next) => {
    var {userId} = req.query;
    deviceService.getDeviceByUserId(userId, (err, result) => {
        if (err != null) {
            res.json(Err.NOT_FOUND);
         } else {
             res.json(result);
         }
    })
})

module.exports = router;