const admin = require('./admin');
const Err = require('../utils/ErrorCode');

module.exports = {

    getToken : (req, res, next) => {
        const idToken = req.headers['authorization'];
        if(typeof idToken !== 'undefined'){
            // console.log(idToken)
            req.token = idToken;
            next();
        }else{
            res.json(Err.INVALID_TOKEN);
        }
    },

    verifyToken : (idToken) => {
        return admin.auth().verifyIdToken(idToken)
            .then((decodeToken) => {
                var uid = decodeToken.uid;
                var name = decodeToken.name;
                console.log(uid, name);
                return {
                    "user_id" : uid,
                    "name" : name
                };
            }).catch((err) => {
                //console.log("code", err.code);
                throw err;
                //return err.message;
            })
    }

}