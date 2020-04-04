const tripRepository = require('../repository/TripRepository');
const userRepository = require('../repository/UserRepository');

var tripService = {}
module.exports = tripService;

/***
 * create infor trip
 * 1, add infor trip to trip table
 * 2, add infor trip to user table
 */
tripService.createInforTrip = (userCreated, tripInfor, callback) => {

    tripInfor.user_created = userCreated;

    tripRepository.createInforTrip(tripInfor, (err, result) => {
        if (err) {

        }
    })

}

/***
 * update infor trip
 */
tripService.updateInforTrip = (tripInfor, callback) => {

}

/***
 * get detail trip
 */
tripService.getDetailTrip = (tripId, callback) => {
    
}