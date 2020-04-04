var ErrMessage = require('./ErrorMessage');

module.exports = {

    //have no token
    UN_AUTHORIZED: ErrMessage(401, "Lỗi xác thực"),

    NOT_FOUND: ErrMessage(404, "Không tìm thấy dữ liệu"),

    INVALID_TOKEN: ErrMessage(498, "Lỗi xác thực. Vui lòng đăng nhập lại"),

    DATA_NOT_NULL: ErrMessage(460, "Dữ liệu không được phép để trống"),

    CONNECT_TO_BD_ERR: ErrMessage(515, "Lỗi kết nối tới database"),

    DATA_CANT_NOT_BE_SAVE : ErrMessage(500, "Không thể lưu dữ liệu"),

    RESULT_OK: ErrMessage(201, "Thành công")
}

