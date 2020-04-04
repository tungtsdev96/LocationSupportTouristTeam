module.exports = function ErrorResponse(statusCode, message) {
    return {
        "status" : statusCode,
        "message": message
    }
}