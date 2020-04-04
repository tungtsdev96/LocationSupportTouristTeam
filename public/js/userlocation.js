// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#config-web-app 
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAj9mDeAUPoqQizvc3pVwP5q_yUoRFju3w",
    authDomain: "locationsupporttouristteam.firebaseapp.com",
    databaseURL: "https://locationsupporttouristteam.firebaseio.com",
    projectId: "locationsupporttouristteam",
    storageBucket: "locationsupporttouristteam.appspot.com",
    messagingSenderId: "792735321645",
    appId: "1:792735321645:web:bfa244a0a5fa117a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: {
            "lat": 20.99733126,
            "lng": 105.84285271
        },
        mapTypeId: 'roadmap'
    });

    var flightPlanCoordinates = [
        {
            "lat": 20.99733126,
            "lng": 105.84285271
        },
        {
            "lat": 20.995285,
            "lng": 105.8428423,
        },
        {
            "lat": 20.99508774,
            "lng": 105.84278782,
        },
        {
            "lat": 20.9949777,
            "lng": 105.8434846,
        },
        {
            "lat": 20.99497719,
            "lng": 105.8437347,
        },
        {
            "lat": 20.9958668,
            "lng": 105.8454643,
        },
        {
            "lat": 20.99608644,
            "lng": 105.84557333,
        },
        {
            "lat": 20.99580204,
            "lng": 105.84607492,
        }
    ];

    var flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    flightPath.setMap(map);
}

