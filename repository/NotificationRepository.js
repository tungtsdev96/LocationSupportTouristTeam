/**
 * import module firebase
 */
const admin = require('../firebase/admin.js');
const db = admin.database();
const notificationRef = db.ref("notifcation");
const userRef = db.ref("user");
const deviceRef = db.ref("device");

/**
 * import module exports
 */
var notificationRepository = {};
module.exports = notificationRepository;

/***
 * get roomId by notify
 */
notificationRepository.getRoomIdByNotify = (notifyId, callback) => {
    notificationRef
        .child(notifyId + "/room_location/room_id")
        .once('value', (snapshot) => {
            callback(snapshot.val());
        })
}

notificationRepository.updateStatusResolve = (notifyId) => {
    notificationRef.child(notifyId).update({
        is_resolve: true
    })
}

notificationRepository.getAllNotifySenderNotResolve = (userId, callback) => {
    notificationRef
        .orderByChild("/sender/user_id")
        .equalTo(userId)
        .once('value', (snapshot) => {
            var rs = [];
            snapshot.forEach(notify => {
                if (notify.val().type == 'SOS' || notify.type == 'ALERT') {
                    var tmp = {};
                    tmp.notify_id = notify.key;
                    tmp.created_time = notify.val().created_time;
                    tmp.type = notify.val().type;
                    tmp.point = notify.val().point;

                    if (notify.val().message) {
                        tmp.message = notify.val().message;
                    }

                    if (notify.val().url_image) {
                        tmp.url_image = notify.val().url_image;
                    }

                    if (notify.val().is_resolve) {
                        tmp.is_resolve = notify.val().is_resolve;
                    } else {
                        tmp.is_resolve = false;
                    }
                    
                    if (!tmp.is_resolve) {
                        rs.push(tmp);
                    }
                }
            })

            callback(rs);
        })
}

/***
 * Get all notification by userID
 * notification received
 */
notificationRepository.getAllNotificationByUserId = (userId, callback) => {
    notificationRef
        .orderByChild("/receiver/" + userId + "/user_id")
        .equalTo(userId)
        .once('value', (snapshot) => {
            var result = [];
            snapshot.forEach(notify => {
                // console.log(notify.val());
                var tmp = {};
                tmp.notify_id = notify.key;
                tmp.created_time = notify.val().created_time;
                tmp.sender = notify.val().sender;
                tmp.room_location = notify.val().room_location;
                tmp.type = notify.val().type;
                tmp.point = notify.val().point;

                if (notify.val().message) {
                    tmp.message = notify.val().message;
                }

                if (notify.val().place_id) {
                    tmp.place_id = notify.val().place_id;
                }

                if (notify.val().url_image) {
                    tmp.url_image = notify.val().url_image;
                }

                if (notify.val().is_resolve) {
                    tmp.is_resolve = notify.val().is_resolve;
                } else {
                    tmp.is_resolve = false;
                }

                var receiver = {};
                if (notify.child('receiver')) {
                    notify.child('receiver').forEach(item => {
                        if (item.val().user_id == userId) receiver = item.val();
                    })
                }

                tmp.receiver = receiver;
                result.push(tmp);
            })
            callback(null, result);
        }, (err) => {
            callback(err, null);
        })
} 

/***
 * remove notify
 */
notificationRepository.removeNotify = (userId, notifyId, callback) => {
    if (!userId || !notifyId) callback(null, null);
    notificationRef
        .child(notifyId + '/receiver/' + userId)
        .set(null, (err) => {
            err ? callback(err, null) : callback(null, {"notifycation_id": notifyId});

            // remove if receiver = 0
            notificationRef.child(notifyId).once('value', (snapshot) => {
                if (!snapshot.hasChild("receiver")) {
                    notificationRef.child(notifyId).set(null);
                }
            })
        })
}

notificationRepository.updateNotify = (notifyId, data) => {
    notificationRef.child(notifyId).update(data);
}

/***
 * remove notify sos
 * DONT'S USE
 */
notificationRepository.removeNotifySOS = (userSenderId, callback) => {
    notificationRef
        .orderByChild("sender/user_id")
        .equalTo(userSenderId)
        .once('value', (snapshot) => {
            
            var notifyId = "";
            snapshot.forEach(item => {
                console.log(item.val().type);
                if (item.val().type == "SOS") {
                    notifyId = item.key;
                    notificationRef.child(notifyId).set(null);
                }
            })

            callback(null, notifyId);
        })
}

/***
 * create notification sos
 * 1, save to DB 
 * 2, push notify (SHARE, ALERT, SOS)
 */
notificationRepository.creatNotification = (data, callback) => {
    // notification table
    var newNotify = notificationRef.push();
    newNotify
        .set(data, (err) => {
            if (err) {
                callback(err, null);
            } else {
                var notifyId = newNotify.key;
                callback(null, notifyId);
                data.url_image = "/public/images/notify/" + notifyId + ".jpg"; 
                pushNotifyAlert(data);
            }
        })

}

/**
 * create notification for invited
 * 1, save notification to db (table notification and table user)
 * 2, push notification
 */
notificationRepository.createNotificationInvited = (data, callback) => {
    
    // notification table
    var newNotify = notificationRef.push();
    newNotify
        .set(data, (err) => {
            if (err) {
                callback(err, null);
            } else {
                var notifyId = newNotify.key;
                callback(null, notifyId);
                pushNotifyInvited(data);
            }
        })
}

/**
 * import module push notification
 */
const NotificationController = require('../push_notification/NotificationController');

/**
 * Push notify Invited
 * @param {data notification to push} data 
 */
var pushNotifyInvited = (data) => {

    var senderName = data.sender.name;
    var roomName = data.room_location.name;

    var message = {
        contents : {  
            "vi": senderName + " đã mời bạn tham gia vào nhóm " + roomName + " để chia sẻ vị trí.", 
            "en" : senderName + " invite you to room location " + roomName 
        },
        headings : {
            "vi" : "Thông báo", "en": "Notification"
        },    
        data : {
            "room_id" : data.room_location.room_id,
            "type" : data.type
        }
    }

    var listUids = data.listUserId;
    var cnt = listUids.length;

    var listPlayerId = [];
    listUids.forEach(uid => {
        deviceRef
            .orderByChild("user_id")
            .equalTo(uid)
            .once('value', (snap) => {
                cnt--;
                if (snap.val() && uid != data.sender.user_id) {
                    var keys = Object.keys(snap.val());
                    listPlayerId.push(keys[0]);
                }
                
                if (cnt == 0) {
                    message.include_player_ids = listPlayerId;
                    console.log("mess", message);

                    // send message
                    NotificationController.sendNotification(message, (err, rs) => {
                        console.log("NotificationPush", {
                            err: err,
                            rs: rs
                        });
                    })
                }
            })
    });
}

var pushNotifyAlert = (data) => {

    var senderName = data.sender.name;

    var dataPayload = {
        "type" : data.type,
    };

    if (data.type == "SHARE_PLACE") {
        data.message = "đã chia sẻ một địa điểm vào trong nhóm."
        dataPayload.place_id = data.place_id;
    }

    dataPayload.room_location = data.room_location;
    dataPayload.sender = data.sender;
    dataPayload.point = data.point;
    dataPayload.message = data.message;
    dataPayload.createdTime = new Date().getTime();

    if (data.url_image) {
        dataPayload.url_image = data.url_image;
    }

    var message = {
        contents : {  
            "vi": senderName + " " + data.message, 
            "en" : senderName + " " + data.message
        },
        headings : {
            "vi" : "Thông báo", "en": "Notification"
        },    
        data : dataPayload,
        priority : 10
    }

    var listUids = data.listUserId;
    var cnt = listUids.length;

    var listPlayerId = [];
    listUids.forEach(uid => {
        deviceRef
            .orderByChild("user_id")
            .equalTo(uid)
            .once('value', (snap) => {
                cnt--;
                if (snap.val()) {
                    var keys = Object.keys(snap.val());
                    listPlayerId.push(keys[0]);
                }
                
                if (cnt == 0) {
                    message.include_player_ids = listPlayerId;
                    console.log("mess", message);

                    // send message
                    NotificationController.sendNotification(message, (err, rs) => {
                        console.log("NotificationPush", {
                            err: err,
                            rs: rs
                        });
                    })
                }
                
            })
    });

}

// contents : {"vi": "Đây là content", "en": "This is content"},
// include_player_ids : ["d8c89753-e65b-43f8-8563-d8195cc95e6a"],
// headings : {"vi" : "heading", "en": "heading en"},
// data : {
//         "senderId" : "aaaa"
// },
// filters : [
//     {"field" : "last_session", "relation" : ">", "hours_ago" : "1"}
// ]

// { 
    //     "room_id": "-LdT2ZIacULzpKPSNEll",
    //     "sender": { 
    //         "phone": "0969798271", 
    //         "user_id": "7T4pGtNj66gv7P2bVAuXHXGuv0z1", 
    //         "name": "test9",
    //         "point" : {
    //              lat: "31213213",
    //              lng: "31213213",
    //          }
    //     }, 
    //     "type": "SOS" 
    // }