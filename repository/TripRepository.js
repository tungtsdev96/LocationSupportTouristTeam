/***
 * include firebase admin
 */
const admin = require('../firebase/admin.js');
const db = admin.database();
const tripRef = db.ref("trip");
const recentedTrip = db.ref("recented_trip");

/**
 * innit module exports
 */
var tripRepository = {}
module.exports = tripRepository;

/**
 * add infor trip to trip table
 */
tripRepository.createInforTrip = (tripInfor, callback) => {

}

/**
 * update infor trip
 */
tripRepository.updateInforTrip = (tripInfor, callback) => {

}

/***
 * get detail trip
 */
tripRepository.getDetailTrip = (tripId, callback) => {
    
}

// getAllTripByUserId : (userId, callback) => {
//     tripRef.orderByChild("user_created/user_id").equalTo(userId).once('value', (snapshot) => {
//         callback(null, snapshot.val());
//     }, (err) => {
//         callback(err, null);
//     })
// },

// createTrip : (tripInfor, callback) => {
    
// },

// deleteTrip : (tripId, callback) => {
//     tripRef.child(tripId).set(null, (err) => {
//         if (err) {
//             //console.log("Err");
//             callback(err);
//         } else {
//             userInGroup.child(groupId).set(null, (err) => {
//                 if (err) {
//                     callback(err, null);
//                 } else {
//                     callback(err, {
//                         "status" : "DELETE_OK"
//                     })
//                 }
//             })
//         }  
//     })
// },

// getDetailTripById : (tripId, callback) => {
//     tripRef.child(tripId).once('value', (snapshot) => {
//          callback(null, snapshot.val());
//      }, (err) => {
//          callback(err, null);
//      })
// },

// getDetailDayOfTrip : (tripId, callback) => {
//     tripRef.child("day_of_trip").once('value', (snapshot) => {
//         callback(null, snapshot.val());
//     }, (err) => {
//         callback(err, null);
//     })
// }
