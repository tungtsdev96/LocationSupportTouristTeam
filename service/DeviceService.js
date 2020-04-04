const deviceRepository = require('../repository/DeviceRepository');
const Err = require('../utils/ErrorCode');
const BaseResponse = require('../utils/BaseResponse');

module.exports = {

    /***
     * update device
     */
    updateDevice : (device, callback) => {
        deviceRepository.updateDevice(device, (err, result) => {
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
    },

    /**
     * get device by userID
     */
    getDeviceByUserId : (userId, callback) => {
        deviceRepository
            .getDeviceByUserId(userId, (err, result) => {
                callback(err, result);
            })
    }

}