const admin = require('../firebase/admin.js');
const db = admin.database();

const deviceRef = db.ref("device");

module.exports = {

    /***
     * update device to DB
     */
    updateDevice : (device, callback) => {
        var playerId = device.player_id;
        deviceRef
            .child(playerId)
            .update(device, (err) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, device);
                }
            })
    },

    /**
     * Get Device by userid
     */
    getDeviceByUserId : (userId, callback) => {
        deviceRef
            .orderByChild("user_id")
            .equalTo(userId)
            .once('value', (snapshot) => {
                var rs = [];
                snapshot.forEach(item => {
                    var obj = {};
                    obj.player_id = item.key;
                    obj.user_id = item.val().user_id;
                    obj.display_name = item.val().display_name;
                    obj.push_token = item.val().push_token;
                    rs.push(obj);
                });
                callback(null, rs);
            }, (err) => {
                callback(err, null);
            })
    }

}
