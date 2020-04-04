const admin = require('../firebase/admin.js');
const db = admin.database();
const userRef = db.ref("user");
const locationUserRef = db.ref("location_user");
const placeSavedRef = db.ref("place_saved");

var userRepository = {

    /**
     * add user
     */
    addUser : (user, callback) => {
        userRef.child(user.user_id).update(user, function(err) { 
            if (err) {
                callback(err, null);
            } else {
                callback(null, {
                    "id" : userRef.child(user.user_id).key,
                    "data": user
                })
            }
        });
    },

    /**
     * search user
     */
    searchUser : (child, queryText, callback) => {
        userRef
            .orderByChild(child)
            .startAt(queryText)
            .endAt(queryText + "\uf8ff")
                .once('value', (snapshot) => {
                    callback(null, snapshot)
                }, (err) => {
                    callback(err, null);
                })
    },

    /**
     * get list user
     */
    getListUser : (callback) => {
        userRef.once('value', (snapshot) => {
            var result = [];

            snapshot.forEach(item => {
                result.push(item.val());
            })

            callback(null, result);
        }, (err) => {
            callback(err, null);
        })
    },

    /**
     * get infor user
     */
    getInforUserById : (userId, callback) => {
        userRef.child(userId).once('value', (snapshot) => {
            callback(null, snapshot);
        }, (err) => {
            callback(err, null);
        })
    },

    /**
     * get Location user from db
     */
    getLocationUser : (userId, callback) => {
        locationUserRef
            .child(userId)
            .once('value', (snapshot) => {
                if (snapshot.val()) {
                    var userLocation = {};
                    userLocation["isOnline"] = snapshot.val().isOnline;
                    userLocation["lastTimeOnline"] = snapshot.val().lastTimeOnline;
                    userLocation["time"] = snapshot.val().time;
                    userLocation["lat"] = snapshot.val().lat;
                    userLocation["lng"]= snapshot.val().lng;
                    callback(userLocation);
                } else {
                    callback(null);
                }
            })
    },

    /**
     * Update Offline
     */
    updateUserOffline : (uid, isOnline) => {
        console.log("offLine", uid);
        locationUserRef
            .child(uid)
            .update({
                "isOnline" : isOnline,
                "lastTimeOnline": Date.now()
            });
    },

}

userRepository.updateNotificationUser = (user_id, data, callback) => {
    userRef
        .child(user_id + "/notification")
        .update(data, (err) => {
            if (err) callback(err, null);
            else callback(null, data);
        })
}

userRepository.getPhoneNumber = async (userId) => {
    var phone = await userRef.child(userId + "/phone").once('value');
    return phone.val();
}

userRepository.deleteUser = (uid, callback) => {
    userRef.child(uid).set(null, (err) => {
        if (err) {
            callback(err, null);
        } else {
            admin.auth().deleteUser(uid)
                .then(function () {
                    callback(null, "Ok");
                })
                .catch(function (error) {
                    callback(error, null);
                });
        }
    })
}

/**
 * sync placesaved
 */
userRepository.savePlaces = (uid, data, callback) => {
    data.forEach(item => {
        placeSavedRef.child(uid).child(item.place_id).update(item);
    })
}

userRepository.getPlaceSaved = (uid, callback) => {
    placeSavedRef.child(uid).once('value', (snapshot) => {
        var places = [];

        snapshot.forEach(item => {
            places.push(item.val());
        })

        callback(null, places);
    }, (err) => {
        callback(err, null);
    })
}

module.exports = userRepository;

