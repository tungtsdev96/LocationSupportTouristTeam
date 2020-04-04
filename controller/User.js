const userRepository = require('../repository/UserRepository');

const express = require('express');
var router = express.Router();
module.exports = router;

router.get('/user', (req, res) => {
    userRepository.getListUser((err, data) => {
        res.render("user", {
            users: data
        });
    })
});


router.get('/location-user/:uid',  (req, res) => {
    var {uid} = req.query;
    res.render("userlocation", {
        uid: uid
    });
})