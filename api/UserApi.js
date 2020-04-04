var express = require('express');
var router = express.Router();
var UserService = require('../service/UserService');
var VerifyToken = require('../firebase/TokenVerify');
var ErrMessage = require('../utils/ErrorMessage');
var Err = require('../utils/ErrorCode');

router.post('/api/user/add-user', (req, res, next) => {
    
    var user = {};

    console.log(req.body);
    if (req.body.user) {
        user = JSON.parse(req.body.user);
    } else {
        user = req.body;
    }

    if (req.files !== null) {
        var file = req.files.uploaded_file;
        var name = file.name;
        for (index = name.length - 1; index > 0; index--) {
            if (name[index] == '.') {
                break;
            }
        }

        hauTo = name.substring(index, name.length);
        var image_name = user.user_id + hauTo;

        console.log(image_name);
        file.mv("./public/images/avatar/" + image_name, function (err) {
            if (err) {
                console.log(err);
            } else {
                var data = user;
                data.url_image = "/public/images/avatar/" + image_name;
                UserService.addUser(data, (err, result) => {

                    if (err != null) {
                        res.json(Err.DATA_CANT_NOT_BE_SAVE);
                    } else {
                        res.json(result);
                    }
                })
            }
        });
    } else {
        var data = user;
        UserService.addUser(data, (err, result) => {
            if (err != null) {
                res.json(Err.DATA_CANT_NOT_BE_SAVE);
            } else {
                res.json(result);
            }
        })
    }

    
})

router.get('/api/user/search', VerifyToken.getToken, (req, res, next) => {
    var idToken = req.token;
    var {queryText} = req.query;
    VerifyToken
                .verifyToken(idToken)
                .then((decodeToken) => {
                    userId = decodeToken.user_id;
                    UserService.searchUser(userId, queryText, (err, result) => {
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

////////////////////////////////////////////////////////

router.get('/api/user/get-all', (req, res, next) => {
    UserService.getListUser((err, result) => {
        if (err != null) {
            res.json(Err.NOT_FOUND);
        } else {
            res.json(result);
        }
    })
})

router.get('/api/user/get-infor', (req, res, next) => {
    var {userId} = req.query;
    UserService.getInforUserById(userId, (err, result) => {
        if (err != null) {
            res.json(Err.NOT_FOUND);
        } else {
            res.json(result);
        }
    })
})

router.put('/api/user/update-user', (req, res, next) => {
    var user = req.body;
    UserService.updateUser(user, (err, result) => {
        if (err != null) {
            res.json(Err.DATA_CANT_NOT_BE_SAVE);
        } else {
            res.json(result);
        }
    })
})

///////////////////////////////////////////////////////
router.put('/api/user/update-on-off', (req, res) => {
    var {userId} = req.query;
    var {isOnline} = req.query;
    UserService.updateUserOffLine(userId, isOnline);
    res.json({
        status : "OK"
    })
})

router.post("/api/user/syncdata", VerifyToken.getToken, (req, res) => {
    var idToken = req.token;
    var data = req.body;
    VerifyToken
                .verifyToken(idToken)
                .then((decodeToken) => {
                    userId = decodeToken.user_id;
                    
                    UserService.syncPlaceOffline(userId, data);
                    res.json(Err.RESULT_OK);
                }).catch((err) => {
                    console.log(err);
                    res.json(Err.INVALID_TOKEN);
                })
})

router.get("/api/user/get-place-saved", (req, res) => {
    var {uid} = req.query;
    UserService.getPlaceSaved(uid, (err, result) => {
        if (err) {
            res.json(Err.NOT_FOUND);
        } else {
            res.json(result);
        }
    })
})

/////////////////////////////////////////////////////
////////////// Web admin ////////////////////////////
router.put('/api/user/disable', (req, res) => {
    var {user_id, url_image} = req.body;
    
    UserService.deleteUser(user_id, (err, rs) => {
        if (err) {
            res.json(Err.DATA_CANT_NOT_BE_SAVE);
        } else {
            res.json(Err.RESULT_OK);
            var fs = require('fs');
            fs.exists("." + url_image, (isExits) => {
                if (isExits) {
                    fs.unlink("." + url_image, (err) => {
                        if (err) console.log("no file");
                        console.log('deleted ' + user_id);
                    });
                }
                
            })
        }
    })
})

router.post('/api/user/register', (req, res) => {

    var user = req.body;
    UserService.registerAccount(user, (err, result) => {
        
        if (err) {
            res.json(Err.DATA_CANT_NOT_BE_SAVE);
        } else {
            res.json(Err.RESULT_OK);
            
            if (req.files !== null) {
                var file = req.files.uploaded_file;
                var name = file.name;
                for (index = name.length - 1; index > 0; index--) {
                    if (name[index] == '.') {
                        break;
                    }
                }

                hauTo = name.substring(index, name.length);
                var image_name = result.user_id + hauTo;

                console.log(image_name);
                file.mv("./public/images/avatar/" + image_name, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        var data = result;
                        data.url_image = "/public/images/avatar/" + image_name;
                        UserService.addUser(data, (err, result) => {
                        })
                    }
                });

            }
        }
    });

})

module.exports = router;