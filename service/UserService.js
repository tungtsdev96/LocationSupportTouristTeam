const userRepository = require('../repository/UserRepository');
const Err = require('../utils/ErrorCode');
const BaseResponse = require('../utils/BaseResponse');

var userService = {

    /**
     * add infor user to DB
     */
    addUser : (user, callback) => {
        userRepository.addUser(user, (err, result) => {
            callback(err, result);
        })
    }, 

    searchUser : (userId, queryText, callback) => {
        userRepository.searchUser("email", queryText, (err, result) => {
            var data = [];
            if (err) {
                callback(err, null);
            } else {
                result.forEach((item) => {
                    var value = item.val();
                    if (value.status && value.user_id != userId) data.push(item.val());
                });
                callback(null, BaseResponse(
                    Err.RESULT_OK.status,
                    data,
                    false
                ));
            }
        })
    },

    getListUser : (callback) => {
        userRepository.getListUser((err, result) => {
            callback(err, result);
        })
    }, 

    getInforUserById : (userId, callback) => {
        userRepository.getInforUserById(userId, (err, result) => {
            callback(err, result);
        })
    },

    /////////////////////////////////////////////////////////////
    updateUser : (data, callback) => {
        userRepository.updateUser(data.user_id, data, (err, result) => {
            callback(err, result);
        })
    }, 

    deleteUser : (idUser, callback) => {
        userRepository.deleteUser(idUser, (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, BaseResponse(
                    Err.RESULT_OK.status,
                    result,
                    false
                ))
            }
        })
    },

    ////////////////////////////////////////////////////////
    updateUserOffLine : (uid, isOnline) => {
        userRepository.updateUserOffline(uid, isOnline);
    },

    /***
     * Sync place saved
     */
    syncPlaceOffline : (uid, data) => {
        userRepository.savePlaces(uid, data);
    },

    getPlaceSaved : (uid, callback) => {
        userRepository.getPlaceSaved(uid, (err, rs) => {
            callback(err, BaseResponse(
                Err.RESULT_OK.status,
                rs,
                false
            ));
        })  
    }
}

const admin = require('../firebase/admin');

userService.registerAccount = (user, callback) => {

    addAccount(user, (uid) => {
        if (uid == null) callback(true, null);

        user.user_id = uid;
        delete user['password'];
        user.created_time = new Date().getTime();
        user.username = user.email.split("@")[0];
        user.status = true;

        userRepository.addUser(user, (err, result) => {
            callback(err, user);
        })
    })

}

addAccount = (user, callback) => {

    admin.auth().createUser({
        email: user.email,
        emailVerified: false,
        password: user.password,
        displayName: user.display_name,
        disabled: false
      }).then(function(userRecord) {
          callback(userRecord.uid);
      }).catch(function(error) {
          console.log('Error creating new user:', error);
          callback(null);
      });

}

module.exports = userService