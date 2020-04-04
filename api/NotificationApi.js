var express = require('express');
var router = express.Router();
var NotificationService = require('../service/NotificationService');
var VerifyToken = require('../firebase/TokenVerify');
var Err = require('../utils/ErrorCode');

module.exports = router;

/***
 * get all notification
 */
router.get('/api/notification/get-all', VerifyToken.getToken, (req, res, next) => {
    var idToken = req.token;
    VerifyToken
        .verifyToken(idToken)
        .then((decodeToken) => {

            var userId = decodeToken.user_id;
            NotificationService.getAllNotificationByUserId(userId, (err, result) => {
                if (err != null) {
                    res.json(Err.NOT_FOUND);
                } else {
                    res.json(result);
                }
            })

        }).catch((err) => {
            console.log(err);
            res.json(Err.INVALID_TOKEN);
        })
    
})

/***
 * delete notification
 */
router.delete('/api/notification/delete', VerifyToken.getToken, (req, res, next) => {
    var {notificationId} = req.query;

    var idToken = req.token;
    VerifyToken
        .verifyToken(idToken)
        .then((decodeToken) => {

            var userId = decodeToken.user_id;
            NotificationService.removeNotify(userId, notificationId, (err, result) => {
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
 * resolve alert
 */
router.put("/api/notification/resolve-alert", (req, res) => {
    var {userId} = req.query;

    NotificationService.resolveAlert(userId, (rs) => {
        res.json(rs);
    })
})

/**
 * get notify not resolve
 */
router.get("/api/notification/get-not-resolve", (req, res) => {
    var {userId} = req.query;
    NotificationService.getAllNotifySenderNotResolve(userId, (rs) => {
        res.json(rs);
    })
})

// test
router.get("/api/notification/get", (req, res) => {
    var {userId} = req.query;

    NotificationService.getAllNotificationByUserId(userId, (err, result) => {
        if (err != null) {
            res.json(Err.NOT_FOUND);
        } else {
            res.json(result);
        }
    })

})