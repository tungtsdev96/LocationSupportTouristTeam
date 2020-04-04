/***
 * import
 */
const NotificationRepository = require('../repository/NotificationRepository');
const RoomService = require('./RoomLocationService');
const Err = require('../utils/ErrorCode');
const BaseResponse = require('../utils/BaseResponse');

/**
 * innit module exports
 */
var notifyService = {};
module.exports = notifyService;

notifyService.resolveAlert = (userSender, callback) => {
    NotificationRepository.getAllNotifySenderNotResolve(userSender, (rs) => {
        rs.forEach(notify => {
            NotificationRepository.updateStatusResolve(notify.notify_id);
        });

        callback(BaseResponse(
            Err.RESULT_OK.status,
            "OK",
            false
        ))
    })
}

/***
 * get All notify sender not resolve
 */
notifyService.getAllNotifySenderNotResolve = (userId, callback) => {
    NotificationRepository.getAllNotifySenderNotResolve(userId, (rs) => {
        callback(rs);
    })
}

/***
 * Get all notification by userID
 */
notifyService.getAllNotificationByUserId = (userId, callback) => {
    NotificationRepository.getAllNotificationByUserId(userId, (err, result) => {
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
}

/**
 * remove notify
 */
notifyService.removeNotify = (userId, notifyId, callback) => {

    //remove notify
    NotificationRepository.removeNotify(userId, notifyId, (err, result) => {
        if (err) {
            callback(Err.DATA_CANT_NOT_BE_SAVE, null);
        } else {
            callback(null, BaseResponse(
                Err.RESULT_OK.status,
                result,
                false
            ))
        }
    })
}

notifyService.updateNotify = (notifyId, data) => {
    NotificationRepository.updateNotify(notifyId, data);
}