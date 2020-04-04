/**
 * innit api call
 */
var apiCaller = {};
module.exports = apiCaller;

/**
 * import and innit http
 */
var https = require('https');

/**
 * make req to push notifi 
 */
var callApi = (host, endpoint, headers, method, data, callback) => {
    var options = {
        host: host,
        port: 443,
        path: endpoint,
        method: method,
        headers: headers
    };

    var req = https.request(options, function (res) {
        res.on('data', function (rs) {
            console.log("Response:", endpoint);
            // console.log(JSON.parse(rs));
            callback(null, JSON.parse(rs));
        });
    });

    req.on('error', function (e) {
        console.log("ERROR:", endpoint);
        // console.log(e);
        callback(e, null);
    });

    req.write(JSON.stringify(data));
    req.end();
}

/***
 * Make Get req to map
 */
var mapApi = (endpoint, callback) => {
    console.log(endpoint);
    
    https.get(endpoint, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            callback(null, JSON.parse(data));
        });

    }).on("error", (err) => {
        callback(err, null);
        console.log("Error: " + err.message);
    });
}

apiCaller.makeReq = mapApi;
apiCaller.callApi = callApi;

