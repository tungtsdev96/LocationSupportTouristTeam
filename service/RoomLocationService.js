/***
 * import
 */
const roomLocationRepository = require('../repository/RoomLocationRepository');
const userRepository = require('../repository/UserRepository');
const Err = require('../utils/ErrorCode');
const BaseResponse = require('../utils/BaseResponse');

/**
 * innit module exports
 */
var roomService = {};
module.exports = roomService;

/***
 * Create room
 *  1, update if user has room
 *  2, create infor room, update in user table
 *  3, add list member to room
 */
roomService.createRoom = (room, callback) => {
    var inforRoom = {};
    inforRoom.name = room.name;
    inforRoom.user_created = room.user_created;
    inforRoom.time_created = ((new Date()).getTime());
    inforRoom.enable = true;
    inforRoom.total_member = 1;

    /***
     *  update if user has room
     */
    roomLocationRepository.getRoomInUserTable(room.user_created.user_id, (err, rs) => {
        if (rs)
        rs.forEach((item) => {
            roomLocationRepository.updateStatusUser(room.user_created.user_id, item.room_id, 0, (err, rs) => {

            });

        })
    })

    /***
     *  create infor room, update in user table
     */
    roomLocationRepository.createRoom(inforRoom, (err, result) => {
        if (err) {
            callback(Err.DATA_CANT_NOT_BE_SAVE, null);
        } else {

            // 3, add list member to room
            var roomId = result.room_id;
            roomService.addMembersToRoom(room.user_created, room.members, roomId, (err, rs) => {
                if (err) {
                    callback(Err.DATA_CANT_NOT_BE_SAVE, null);
                } else {
                    callback(null, BaseResponse(
                        Err.RESULT_OK.status,
                        result,
                        false
                    ));
                }
            })
        }
    })

},

    /**
     * Get Room By Id
     * @param {*} roomId 
     * @param {*} callback 
     */
    roomService.getRoomById = (roomId, callback) => {
        roomLocationRepository.getRoomById(roomId, (err, result) => {
            if (err != null) {
                callback(Err.NOT_FOUND, null);
            } else {
                result.room_id = roomId;
                callback(null, BaseResponse(
                    Err.RESULT_OK.status,
                    result,
                    false
                ))
            }
        })
    },

    /***
     * Get room user joined
     */
    roomService.getRoomByUserId = (userId, callback) => {
        roomLocationRepository.getRoomUserJoin(userId, (err, result) => {
            if (err != null) {
                callback(Err.NOT_FOUND, null);
            } else {
                callback(null, BaseResponse(
                    Err.RESULT_OK.status,
                    result,
                    false
                ))
            }
        })
    },

    /***
     * get all member
     */
    roomService.getAllMember = (userId, roomId, callback) => {
        roomLocationRepository.getListMember(userId, roomId, (err, result) => {
            if (err) {
                callback(Err.NOT_FOUND, null);
            } else {
                callback(null, BaseResponse(
                    Err.RESULT_OK.status,
                    result,
                    false
                ))
            }
        })
    },

    /**
     * Join Group
     * @param {*} userId 
     * @param {*} roomId 
     * @param {*} callback 
     */
    roomService.joinGroup = (userId, roomId, callback) => {

        // 1, update if user has room
        roomLocationRepository.getRoomInUserTable(userId, (err, rs) => {

            var tmp = "";
            for (var i = 0; i < rs.length; i++) {
                var item = rs[i];
                if (item.status == 2) {
                    tmp = item.room_id;
                    break;
                }
            }

            if (tmp) {
                roomService.updateStatusGroup(userId, tmp, 0, (err, rs) => {
                    // 2, update status group
                    roomService.updateStatusGroup(userId, roomId, 2, (err, result) => {
                        callback(err, result);
                    })
                });
            } else {
                // 2, update status group
                roomService.updateStatusGroup(userId, roomId, 2, (err, result) => {
                    callback(err, result);
                })
            }
        })
    }

/***
 * update status user in group
 * TODO : update room location, update user
 */
roomService.updateStatusGroup = (userId, roomId, status, callback) => {
    // console.log(userId, roomId);
    roomLocationRepository.updateStatusUser(userId, roomId, status, (err, rs) => {
        if (err) callback(err, null);
        else {
            roomLocationRepository.updateStatusUserInRoom(userId, roomId, status);
            callback(null, BaseResponse(
                Err.RESULT_OK.status,
                "OK",
                false
            ));
        }
    });
},

    /***
     * Search Member To Add
     */
    roomService.searchMemberToAdd = (userId, roomId, queryText, callback) => {
        userRepository.searchUser("email", queryText, (err, result) => {
            var data = [];
            if (err) {
                callback(err, null);
            } else {
                result.forEach((item) => {
                    if (item.val().status && item.val().user_id != userId) {
                        
                        var member = {};
                        member.user_id = item.val().user_id;
                        member.display_name = item.val().display_name;
                        member.email = item.val().email;
                        member.url_image = item.val().url_image;

                        var status = item.child("room_location/" + roomId + "/status").val();
                        // console.log(member.user_id, status);
                        if (status !== null) {
                            member.room_id = roomId;
                            member.status = item.child("room_location/" + roomId + "/status");
                        } else {
                            member.room_id = roomId;
                            member.status = 0;
                        }

                        if (status != 2) data.push(member);
                    }
                });
                callback(null, BaseResponse(
                    Err.RESULT_OK.status,
                    data,
                    false
                ));
            }
        })
    },

    /***
     * add members to room
     */
    roomService.addMembersToRoom = (userSendNotify, members, roomId, callback) => {

        // update status in user table
        var listMembers = {};
        var listUserId = [];
        members.forEach(item => {
            var userId = item.user_id;
            listUserId.push(userId);
            listMembers[userId] = item;
            roomLocationRepository.updateStatusUser(userId, roomId, item.status, (err, rs) => {

            });
        });

        // add list member to room
        roomLocationRepository.addListMemberToRoom(roomId, listMembers, (err, result) => {
            if (err) {
                callback(Err.DATA_CANT_NOT_BE_SAVE, null);
            } else {
                callback(null, BaseResponse(
                    Err.RESULT_OK.status,
                    result.message,
                    false
                ));

                createNotificationInvited(userSendNotify, members, roomId);
            }
        })
    }

/***
 * TODO : DON'T USE
 * Create invitation
 */
roomService.sendInvitation = (userSendNotify, user, roomId, callback) => {
    // 1, check invited user and room
    notifyRepository.getAllNotificationByUserId(user.user_id, (err, result) => {

        var notifyId = {};

        for (var i = 0; i < result.length; i++) {
            var item = result[i];
            if (item.room_location && item.type == "INVITED") {
                if (item["room_location"].room_id == roomId) {
                    notifyId = item.notify_id;
                    break;
                }
            }
        }

        // 2, create invited
        if (!notifyId) {
            var users = [];
            users.push[user];
            roomService.addMembersToRoom(userSendNotify, users, roomId, (err, result) => {
                callback(err, result);
            })
        } else {
            callback(err, BaseResponse(
                Err.RESULT_OK.status,
                "INVITED",
                false
            ));
        }

    })

}

/**
 * Remove invitation
 */
roomService.removeInvitation = (userId, roomId, callback) => {
    console.log(userId, roomId);
    // 1, find idNotify => remove notify
    notifyRepository.getAllNotificationByUserId(userId, (err, result) => {

        var notifyId = "";

        for (var i = 0; i < result.length; i++) {
            var item = result[i];
            if (item.room_location && item.type == "INVITED") {
                if (item["room_location"].room_id == roomId) {
                    notifyId = item.notify_id;
                    break;
                }
            }
        }

        if (notifyId) {
            console.log("remove Noty", notifyId);
            notifyRepository.removeNotify(userId, notifyId, (err, rs) => { })
        }

        // 2, update status -> left = 0
        roomService.updateStatusGroup(userId, roomId, 0, (err, rs) => {
            callback(err, rs);
        })


    })
}

/**
 * get action user in room
 * DON'T USE
 */
roomService.getActionUser = (userId, roomId, callback) => {
    roomLocationRepository.getActionUserInRoom(userId, roomId, (err, result) => {
        callback(err, BaseResponse(
            Err.RESULT_OK.status,
            result,
            false
        ));
    })
}

/***
 * action send notify sos
 */
roomService.actionNotifySos = (userSendNotify, roomId, action, callback) => {

    roomLocationRepository.actionNotifySos(userSendNotify.user_id, roomId, action, (err, rs) => {
        if (err) {
            callback(err, Err.DATA_CANT_NOT_BE_SAVE);
        } else {
            callback(null, BaseResponse(
                Err.RESULT_OK.status,
                rs,
                false
            ));

            if (action == "true") createNotifySos(userSendNotify, roomId);
            else {
                notifyRepository.removeNotifySOS(userSendNotify.user_id, (err, rs) => {
                    console.log("remove notify sos", err, rs);
                })
            }
        }
    })

}

/**
 * post alert in room location
 */
roomService.postAlert = (data, callback) => {
    data.created_time = new Date().getTime();

    if (data.type == "SOS" || data.type == "ALERT") {
        data.is_resolve = false;
    }

    //// user receive notify
    var listUserId = [];
    data["receiver"] = {};
    roomLocationRepository.getListMember(data.sender.user_id, data.room_location.room_id, (err, rs) => {
        console.log(rs);
        rs.forEach(u => {
            // remove invited
            if (u.status == 1) return;
            var tmp = {};
            tmp.user_id = u.user_id;
            tmp.display_name = u.display_name;

            listUserId.push(tmp.user_id);
            data["receiver"][u.user_id] = tmp;
        })
        data.listUserId = listUserId;

        // save notify to DB
        notifyRepository.creatNotification(data, (err, notifyId) => {

            console.log("creatNotification", {
                err: err,
                notifyId: notifyId
            })
            
            notifyRepository.updateNotify(notifyId, {
                url_image: "/public/images/notify/" + notifyId + ".jpg"
            })

            callback(BaseResponse(
                Err.RESULT_OK.status,
                notifyId,
                false
            ));

        })
    })
}

/**
 * [START INPORT ROTIFICATION REPOSITORY]
 * import notification repository
 */
const notifyRepository = require('../repository/NotificationRepository');

/**
 * innit notification
 * @param {*} userSendNotify user created notify
 * @param {*} users    list user to send notify
 */
var createNotificationInvited = (userSendNotify, users, roomId) => {
    var data = {};

    // sender 
    data.sender = userSendNotify;

    // user receive notify
    var listUserId = [];
    data["receiver"] = {};
    users.forEach((item) => {
        var tmp = {};
        tmp.user_id = item.user_id;
        tmp.display_name = item.display_name;
        tmp.isRead = false;

        listUserId.push(tmp.user_id);
        data["receiver"][item.user_id] = tmp;
    })
    data.listUserId = listUserId;

    // type 
    data.type = "INVITED";

    // created_time
    data.created_time = new Date().getTime();

    // roomlocation
    roomLocationRepository.getRoomById(roomId, (err, result) => {
        var room = {};
        room.room_id = roomId;
        room.name = result.name;
        data["room_location"] = room;

        notifyRepository.createNotificationInvited(data, (err, rs) => {
            console.log("createNotificationInvited", {
                err: err,
                rs: rs
            })
        })
    })
}

/************ TEST ****************/
/***
 * get all room
 */
roomService.getAll = (callback) => {
    roomLocationRepository.getAllRoom((err, result) => {
        callback(err, result);
    })
}

/**
 * Delete Room
 */
roomService.delete = (roomId, callback) => {
    roomLocationRepository.delete(roomId);
}