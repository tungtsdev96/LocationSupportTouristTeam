module.exports = function ErrorResponse(statusCode, results, isNextPage) {
    return {
        "status" : statusCode,
        "result" : results,
        "next_page": isNextPage
    }
}