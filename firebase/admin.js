var admin = require('firebase-admin');

// Fetch the service account key JSON file contents
var serviceAccount = require('../key/serviceAccountFireBase.json');

// Initialize the app with a service account, granting admin privileges
var DATABASE_URL = "DATABASE_URL_HERE";
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: DATABASE_URL
})

module.exports = admin;