const userRepository = require('./UserRepository');
const admin = require('../firebase/admin.js');
const db = admin.database();

const roomLocationRef = db.ref("room_location");
const membersOfRoomLocationRef = db.ref("members_of_room_location");
const userRef = db.ref("user");

var roomRepository = {

    /**
     * Create new room
     */
    createRoom: (room, callback) => {
        var addRoomLocationRef = roomLocationRef.push();
        addRoomLocationRef
            .set(room, (err) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, {
                        "room_id": addRoomLocationRef.key,
                        "name": room.name
                    });
                }
            })
    },

    /**
     * add list member to room
     */
    addListMemberToRoom: (roomId, members, callback) => {
        membersOfRoomLocationRef
            .child(roomId)
            .update(members, (err) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, {
                        "room_id": roomId,
                        "status": 201,
                        "message": "Các thành viên đã được thêm vào nhóm"
                    })


                }
            })
    },

    /***
     * Update status user in user table
     */
    updateStatusUser: (userId, roomId, status, callback) => {

        if (status == 0) {
            userRef.child(userId + "/room_location/" + roomId)
                .set(null, (err) => {
                    if (err) callback(err, null);
                    else callback(null, {
                        "user_id": userId,
                        "rooom_id": roomId,
                        "status": status
                    })
                });
        } else {
            var value = {}
            value["room_id"] = roomId;
            value["status"] = status;

            var room = {}; room[roomId] = value;

            userRef
                .child(userId + "/room_location")
                .update(room, (err) => {
                    if (err) callback(err, null);
                    else callback(null, {
                        "user_id": userId,
                        "rooom_id": roomId,
                        "status": status
                    })
                });
        }
    },

    /***
     * update status user of roomlocation
     */
    updateStatusUserInRoom: (userId, roomId, status, callback) => {
        if (status == 0) {
            membersOfRoomLocationRef
                .child(roomId).child(userId).set(null);
        } else {
            membersOfRoomLocationRef
                .child(roomId).child(userId).update({
                    "status": status
                });
        }

    },

    getRoomById: (roomId, callback) => {
        roomLocationRef
            .child(roomId)
            .once('value', (snapshot) => {
                callback(null, snapshot.val());
            }, (err) => {
                callback(err, null);
            })
    },

    //////////// get room by user ///////////////////////////
    getRoomUserJoin: (userId, callback) => {
        userRepository.getInforUserById(userId, (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                var rs = null;
                result.child("room_location").forEach(item => {
                    // console.log(item.val());
                    // if (item.val().status > 0) {
                    //     var r = item.val();
                    //     r.user_id = userId;
                    //     rs.push(r);
                    // }
                    if (item.val().status == 2) {
                        rs = item.val().room_id;
                    }
                });
                callback(null, rs);
            }
        })
    },

    // get room in user table
    getRoomInUserTable: (userId, callback) => {
        userRepository.getInforUserById(userId, (err, result) => {
            console.log(userId, result.val());
            if (err) {
                callback(err, null);
            } else {
                var rs = [];
                if (result.child("room_location"))
                result.child("room_location").forEach(item => {
                    console.log(item.val());
                    if (item.val().status > 0) {
                        var r = item.val();
                        r.user_id = userId;
                        rs.push(r);
                    }
                    // if (item.val().status == 2) {
                    //     rs = item.val().room_id;
                    // }
                });
                callback(null, rs);
            }
        })
    },

    /////// get all member of room /////////////////////
    getListMember: (uid, roomId, callback) => {
        // console.log("get list member", uid, roomId);
        membersOfRoomLocationRef
            .child(roomId)
            .once('value', (snapshot) => {
                var rs = [];
                var length = snapshot.numChildren();
                snapshot.forEach((item) => {
                    var member = item.val();
                    var userId = member.user_id;
                    if (!member.action) member.action = "false";
                    
                    // get location user
                    userRepository.getLocationUser(userId, async (location) => {
                        userRepository
                            .getPhoneNumber(userId)
                            .then((phone) => {
                                length--;
                                if (location) {
                                    member.user_location = location;
                                }
                                member.phone = phone;
                                member.user_location.isOnline = member.user_location.isOnline == "true" ? true : false
                                if (member.user_id != uid) rs.push(member);
                                if (length == 0) callback(null, rs);
                            })
                    })
                })
            }, (err) => {
                callback(err, null)
            })
    },

    /////////////////////// get status Room by userID ///////////
    getStatusUserInRoom: async (userId, roomId) => {
        var status = await userRef
            .child(userId + "/room_location/" + roomId + "/status")
            .once("value");
        return status.val();
    },

    /***
     * update status sos
     * DONT'USE
     */
    actionNotifySos: (userId, roomId, action, callback) => {
        membersOfRoomLocationRef.child(roomId).child(userId)
            .update({
                action: action
            }, (err) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, {
                        roomId: roomId,
                        userId: userId
                    })
                }
            })
    },

    /**
     * get action user in room
     * DONT'T USE
     */
    getActionUserInRoom: (userId, roomId, callback) => {
        membersOfRoomLocationRef
            .child(roomId + '/' + userId + '/action')
            .once('value', (snapshot) => {
                if (snapshot.val()) {
                    callback(null, snapshot.val());
                } else {
                    callback(null, {
                        action: "false"
                    });
                }
            }, (err) => {
                callback(err, null);
            })
    }
}

module.exports = roomRepository;

roomRepository.getAllRoom = (callback) => {
    roomLocationRef
        .once('value', (snapshot) => {
            var results = {};
            var length = snapshot.numChildren();
            snapshot.forEach(room => {
                var roomId = room.key;
                results[roomId] = room.val();

                membersOfRoomLocationRef.child(roomId).once('value', (snapshot) => {
                    length--;
                    results[roomId]["members"] = snapshot.val();
                    if (length == 0) callback(null, results);
                })
            })
        }, (err) => {
            callback(err, null);
        })
}

roomRepository.delete = (roomId, callback) => {
    roomRepository.getListMember(roomId, (err, result) => {
        var length = result.length;
        result.forEach(item => {
            length--;
            console.log(item.user_id);
            roomRepository.updateStatusUser(item.user_id, roomId, 0, (err, rs) => {

            });
            if (length == 0)
                membersOfRoomLocationRef.child(roomId).set(null, (err) => {
                    console.log(err);
                });
        })
    })


    roomLocationRef.child(roomId).set(null, (err) => {
        console.log(err);
    });
}

