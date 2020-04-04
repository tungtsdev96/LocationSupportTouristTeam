/**
 * Created by Tungts
 * call api for push notification
 */

/**
 * Import Axios
 */
var ApiCaller = require('../utils/ApiCaller');

/***
 * import const
 */
const host = "onesignal.com";
var REST_API_KEY = "YOUR_REST_API_KEY";
var APP_ID = "YOUR_APP_ID";
const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Authorization": "Basic " + REST_API_KEY
};
const app_id = APP_ID;

/**
 * innit module exports
 */
var NotifyController = {};
module.exports = NotifyController;

/***
 * Create and send notification
 */
var sendNotification = function(data, callback) {
    data.app_id = app_id;
    ApiCaller.callApi(
        host, 
        "/api/v1/notifications",
        headers,
        "POST",
        data,
        (err, result) => {
            callback(err, result);
        })
};
  
/***
 * CancelMessage
 */
var cancelNotification = function(notificationId, callback) {
  ApiCaller.callApi(
        host, 
        "/api/v1/notifications/" + notificationId + "?app_id=" + app_id,
        headers,
        'DELETE',
        null,
        (err, result) => {
            callback(err, result);
        })
}

NotifyController.sendNotification = sendNotification;
NotifyController.cancelNotification = cancelNotification;

