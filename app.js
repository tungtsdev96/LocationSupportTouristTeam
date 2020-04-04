const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const upload = require("express-fileupload");

const app = express();
const server = require('http').Server(app);
const constans = require('./utils/Constants');

app.use(upload());
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./views")
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// parse application/json
app.use(bodyParser.json());

/*
    folder public: cho phep ng dung tai xuong
    /assets: sd middleware dinh nghia folder ma ng dung co the truy cap de tai xuong 
*/ 
app.use("/public", express.static(__dirname + "/public"));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "GET,PUT,POST,DELETE,PATCH,OPTIONS, Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next(); 
});

var userApi = require('./api/UserApi');
app.use('/', userApi);

var tripApi = require('./api/TripApi');
app.use('/', tripApi);

var roomLocationApi = require('./api/RoomLocationApi');
app.use('/', roomLocationApi);

var deviceApi = require('./api/DeviceApi');
app.use('/', deviceApi);

var notificationApi = require('./api/NotificationApi');
app.use('/', notificationApi);

var NewFeedApi = require('./api/NewFeedApi');
app.use('/', NewFeedApi);

var placeApi = require('./api/PlaceApi');
app.use('/', placeApi);

app.get('/', (req, res) => res.send('Welcome To Back End Location Support team'))

var loginController = require('./controller/Login');
app.use('/', loginController);


var userController = require('./controller/User');
app.use('/', userController);

/***
 * Test PushNotification
 */
// var PushNotification = require('./push_notification/NotificationController')
// app.get('/push', (req, res) => {
//     var {type} = req.query;
//     if (type == 1) {
//         var data = {
//             contents : {"vi": "Đây là content", "en": "This is content"},
//             include_player_ids : ["d8c89753-e65b-43f8-8563-d8195cc95e6a"],
//             headings : {"vi" : "heading", "en": "heading en"},
//             // data : {
//             //     "senderId" : "aaaa"
//             // },
//             // filters : [
//             //     {"field" : "last_session", "relation" : ">", "hours_ago" : "1"}
//             // ]
//         }

//         PushNotification.sendNotification(data, (err, rs) => {
//             res.json({
//                 err: err,
//                 rs: rs
//             });
//         })
//     } else {
//         PushNotification.cancelNotification(type, (err, rs) => {
//             res.json({
//                 err: err,
//                 rs: rs
//             });
//         })   
//     }
// })

///////////////// Log tracking location ///////////////////////////
// const admin = require('./firebase/admin');
// const db = admin.database();

// db.ref("location_user").once("value" , (snapshot) => {
//     console.log(snapshot.val());
// }, (err) => {
//     console.log("The read failed: " + errorObject.code);
// })

// const fs = require('fs');
// db.ref("location_user").on("child_changed", function(snapshot) {
//     console.log("child_changed", snapshot.val());
    
//     var date = new Date();
//     var folder = "./log/" + date.getDate() + "-" + (date.getMonth() + 1);
    
//     if (!fs.existsSync(folder)) {
//         fs.mkdirSync(folder);
//     }

//     var fileName ="/location_50.json"
//     fs.appendFileSync(folder + fileName, JSON.stringify(snapshot.val()) + ",", function (err) {
//         if (err) throw err;
//     });

//   }, function (errorObject) {
//     console.log("The read failed: " + errorObject.code);
//   });

// db.ref("location_user").on("child_added", function(snapshot) {
//     console.log("child_added");
//     console.log(snapshot.val());
//   }, function (errorObject) {
//     console.log("The read failed: " + errorObject.code);
//   });

// db.ref("location_user").on("child_removed", function(snapshot) {
//     console.log("child_removed");
//     console.log(snapshot.val());
//   }, function (errorObject) {
//     console.log("The read failed: " + errorObject.code);
//   });
//////////////////////////////////////////////////////

app.listen(3000, function () {
    console.log("Server started in port 3000...");
});
