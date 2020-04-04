var express = require('express');
var router = express.Router();
var RoomLocationService = require('../service/RoomLocationService');
var VerifyToken = require('../firebase/TokenVerify');
var Err = require('../utils/ErrorCode');

// create room
router.post("/api/room-location/create", VerifyToken.getToken, (req, res, next) => {
    var idToken = req.token;
    var data = req.body;
    if (!data) res.json(Err.DATA_NOT_NULL);
    else
        VerifyToken
            .verifyToken(idToken)
            .then((decodeToken) => {
                var obj = {};
                obj.user_id = decodeToken.user_id;
                obj.name = decodeToken.name;

                data.user_created = obj;
                RoomLocationService.createRoom(data, (err, result) => {
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

/***
    get infor room by id 
*/
router.get("/api/room-location/get-infor", (req, res, next) => {
    var { roomId } = req.query;
    RoomLocationService.getRoomById(roomId, (err, result) => {
        if (err != null) {
            res.json(Err.NOT_FOUND);
        } else {
            res.json(result);
        }
    })
})

/***
 * get rooom by user
 */
router.get("/api/room-location/get-by-user", VerifyToken.getToken, (req, res, next) => {
    var idToken = req.token;
    VerifyToken
        .verifyToken(idToken)
        .then((decodeToken) => {

            var userId = decodeToken.user_id;
            RoomLocationService.getRoomByUserId(userId, (err, result) => {
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
 * get member of room
 * TODO add token
 */
router.get("/api/room-location/get-member", VerifyToken.getToken, (req, res, next) => {
    var { roomId } = req.query;
    var idToken = req.token;
    VerifyToken
        .verifyToken(idToken)
        .then((decodeToken) => {

            var userId = decodeToken.user_id;
            RoomLocationService.getAllMember(userId, roomId, (err, result) => {
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
 * update status user in room
 * 0 - left
 * 1 - invited
 * 2 - joined
 */
router.get("/api/room-location/update-status", (req, res, next) => {
    var { userId } = req.query;
    var { roomId } = req.query;
    var { status } = req.query;
    RoomLocationService.updateStatusGroup(userId, roomId, status, (err, result) => {
        if (err != null) {
            res.json(Err.DATA_CANT_NOT_BE_SAVE);
        } else {
            res.json(result);
        }
    })
})

/***
 * Search user for room
 */
router.get("/api/room-location/search-user", VerifyToken.getToken, (req, res, next) => {
    var idToken = req.token;
    var { roomId } = req.query;
    var { queryText } = req.query;

    VerifyToken
        .verifyToken(idToken)
        .then((decodeToken) => {
            var userId = decodeToken.user_id;

            RoomLocationService.searchMemberToAdd(userId, roomId, queryText, (err, result) => {
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

/***
 * add members to room
 */
router.post("/api/room-location/add-members", VerifyToken.getToken, (req, res, next) => {
    var idToken = req.token;
    var {roomId} = req.query;
    var members = req.body;

    if (!members) res.json(Err.DATA_NOT_NULL);
    else
        VerifyToken
            .verifyToken(idToken)
            .then((decodeToken) => {
                var obj = {};
                obj.user_id = decodeToken.user_id;
                obj.name = decodeToken.name;

                RoomLocationService.addMembersToRoom(obj, members, roomId, (err, result) => {
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
 * join group
 */
router.put("/api/room-location/join-room", VerifyToken.getToken, (req, res, next) => {
    var {roomId} = req.query;
    var idToken = req.token;
    
    VerifyToken
        .verifyToken(idToken)
        .then((decodeToken) => {
            var userId = decodeToken.user_id;
            
            RoomLocationService.joinGroup(userId, roomId, (err, result) => {
                if (err != null) {
                    res.json(Err.DATA_CANT_NOT_BE_SAVE);
                } else {
                    console.log(result);
                    res.json(result);
                }
            })

        }).catch((err) => {
            console.log(err);
            res.json(Err.INVALID_TOKEN);
        })
})

/**
 * TODO : DON'T USE
 * remove invitation
 */
router.put("/api/room-location/remove-invitation", (req, res, next) => {
    var {roomId} = req.query;
    var {userId} = req.query;
    RoomLocationService.removeInvitation(userId, roomId, (err, result) => {
        if (err != null) {
            res.json(Err.DATA_CANT_NOT_BE_SAVE);
        } else {
            res.json(result);
        }
    })
})

/***
 * Send Invitation 
 */
router.put("/api/room-location/send-invitation", VerifyToken.getToken, (req, res, next) => {
    var idToken = req.token;
    var {roomId} = req.query;
    var member = req.body;

    if (!member) res.json(Err.DATA_NOT_NULL);
    else
        VerifyToken
            .verifyToken(idToken)
            .then((decodeToken) => {
                var obj = {};
                obj.user_id = decodeToken.user_id;
                obj.name = decodeToken.name;

                RoomLocationService.sendInvitation(obj, member, roomId, (err, result) => {
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
 * Notify SOS
 */
router.put("/api/room-location/sos", VerifyToken.getToken, (req, res, next) => {
    var {roomId} = req.query;
    var {action} = req.query;
    var idToken = req.token;
    
    console.log("room_action", roomId);

    VerifyToken
        .verifyToken(idToken)
        .then((decodeToken) => {
            var obj = {};
            obj.user_id = decodeToken.user_id;
            obj.name = decodeToken.name;

            RoomLocationService.actionNotifySos(obj, roomId, action, (err, rs) => {
                res.json(rs);
            })
            
        }).catch((err) => {
            console.log(err);
            res.json(Err.INVALID_TOKEN);
        })
})

/**
 * get Action user in room
 * (DON'T USE)
 */
router.get("/api/room-location/get-action", VerifyToken.getToken, (req, res, next) => {

    var {roomId} = req.query;
    var idToken = req.token;
    
    console.log("room_action", roomId);

    VerifyToken
        .verifyToken(idToken)
        .then((decodeToken) => {
            var userId = decodeToken.user_id;

            RoomLocationService.getActionUser(userId, roomId, (err, rs) => {
                if (err != null) {
                    res.json(Err.NOT_FOUND);
                } else {
                    res.json(rs);
                }
            })
            
        }).catch((err) => {
            console.log(err);
            res.json(Err.INVALID_TOKEN);
        })

})

/**
 * post alert
 */
router.post("/api/room-location/post-alert", (req, res, next) => {
    var notify = {};
    notify = JSON.parse(req.body.notify);

    if (!notify) res.json(Err.DATA_NOT_NULL);
    else {
        RoomLocationService.postAlert(notify, (rs) => {
            
            var notifyId = rs.result;
            
            // save image uploaded
            if (req.files !== null) {
                var file = req.files.uploaded_file;
        
                var image_name = notifyId + ".jpg";
        
                console.log(image_name);
                file.mv("./public/images/notify/" + image_name, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("upload ok");
                    }
                });
            } else {
                console.log("no image");
            }

            res.json(rs);
        })
    }
})

// test
router.get("/api/room-location/get-by-userId", (req, res, next) => {
    var { userId } = req.query;
    RoomLocationService.getRoomByUserId(userId, (err, result) => {
        if (err != null) {
            res.json(Err.NOT_FOUND);
        } else {
            res.json(result);
        }
    })
})

// test create room
router.post("/api/room/create", (req, res, next) => {
    var data = req.body;
    var obj = {};
    obj.user_id = req.query.user_id;
    obj.name = req.query.name;
    data.user_created = obj;
    RoomLocationService.createRoom(data, (err, result) => {
        if (err != null) {
            res.json(Err.DATA_CANT_NOT_BE_SAVE);
        } else {
            res.json(result);
        }
    })
})

// get all room
router.get('/api/room/get-all', (req, res, next) => {
    RoomLocationService.getAll((err, data)=> {
        res.json({
            rs: data,
            err: err
        })
    })
})

// delete
router.delete('/api/room/delete', (req, res) => {
    RoomLocationService.delete(req.query.roomId);
    res.json({
        rs: "OK"
    })
})

module.exports = router;

