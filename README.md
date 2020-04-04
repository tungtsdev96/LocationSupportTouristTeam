# LocationSupportTouristTeam
This is the backend for the group support application when traveling in the form of long-distance travel (backpacking, hiking, climbing, adventure Travel...).

This provides RESTful API for the purpose of data communication between client and database. Currently, the client in system is Android application. Read more [here](https://github.com/tungtsdev96/LocationSupportTouristTeam-AndroidApp)

## The system includes main funtions here:
* Support all member of group travel to get current location of the each other members.
* Share any point from map to team.
* Notify to team whenever meet a problem or an acident.
* Support for searching place on map by name or place nearby current location by place type.
* To get more basic functions of the system go to [here](https://github.com/tungtsdev96/LocationSupportTouristTeam-AndroidApp)

## Framework, Platform integrated
- The first, This project is written by [ExpressJS](https://expressjs.com/) one of framework NodeJS.
- Secondly, Platform Firebase for storing and sync database, update current location of user by 
[Realtime Databas](https://firebase.google.com/docs/database/admin/start) and simply authenticate user by [Firebase Authentication](https://firebase.google.com/docs/auth). 
- Thirdly, I used GoogleMapApi for finding the best way to moving between two points by [DirectionApi](https://developers.google.com/maps/documentation/directions/intro) and [PlaceAPI](https://developers.google.com/places/web-service/intro) to serching any place and nearby place in map.
- Finally, I intergrate [OneSignal](https://onesignal.com/) in order to push notification to client device.

## Database 
I used Firebase Realtime Database in order to store all data of and update user's current location
This databse include 13 tables:

1. **user**: used to store all basic information of users.
2. **location_user**: update current location of user in real time. This has one-to-one relationship with user table.
3. **device_user**: store current device that user log in for using app and it save device token to push notification. This has one-to-one relationship with user table.
4. **room_location**: store basic information for each group that want to share location in trip.
5. **member_of_room**: let us know all member of room and each status of member (ENABLE or DISABLE). This has many-to-one relationship with user and room_location table.
6. **notification**: save all notification that was sent from a member of team. That related to sharing location, notify a problem or the invitation join to room.
7. **user_receiver**: store user who will be recipient. This has many-to-one relationship with user and notification table.
8. **place**: store place infomation with exactly coordinator. 
9. **place_saved**: record place that user want to saving. This has many-to-one relationship with user and place table.

# Run project

## Step 1: Config environment: 
- Install Nodejs and npm from [NodeJS's home page](https://nodejs.org/en/) and clone this project. You should download recommend version of NodeJS.

- Open terminal at folder of project and run command line

   ```
   npm install  
   ```

## Step 2: Create an app on [FirebaseConsole](https://console.firebase.google.com/)

In this system I will add Firebase to Android project. 
In order to create app on Firebase follow [this guide](https://firebase.google.com/docs/android/setup).

Next, we need add [firebase sdk](https://firebase.google.com/docs/admin/setup#set-up-project-and-service-account) to this project. 
You can also follow below step: 

#### Adding SDK by command line:
   ``` 
   $ npm install firebase-admin --save
   ```

#### Get your DATABASE_URL from your [Firebase Console](https://console.firebase.google.com)
 -  Choose your project you've just created.
 -  Goto **Database** -> **Real-time Database**.
 -  Coppy DATABASE_URL from the top of table.
 -  Open file /firebase/admin.js and update DATABASE_URL_HERE with your DATABASE_URL


>

    // Initialize the app with a service account, granting admin privileges
    var DATABASE_URL = "DATABASE_URL_HERE";
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: DATABASE_URL
    )}


#### Finally,  Generate a private key file for your service account:
- In the Firebase console, open Settings > (Service Accounts)[https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk].
- Click Generate New Private Key, then confirm by clicking Generate Key.
- Download and save to folder "/key" in your project.

## Step 3: Create an app on GoogleMapAPI

1. Login to GooolgeAccount(gmail) after access to link [Google Console](https://console.cloud.google.com/)

2. Choose project -> Create project -> Click "Create".

3. Click "Left Drawer" on the top-left of page to show menu -> APIs & Services -> Library.

4. Search "Directions API" -> Click "Enable". Back to library menu search "Places API" and Enable that.

5. Get API key: 

 - Visit the [Google Cloud Platform Console](https://cloud.google.com/console/google/maps-apis/overview)  
 -  Click the project drop-down and select or create the project for which you want to add an API key.
 - Click the menu button  and select APIs & Services > Credentials.
 - On the Credentials page, click Create credentials > API key.
 - The API key created dialog displays your newly created API key.
 - Coppy the API key Click Close.
 - Update value of variable "KEY_GG_MAP" from file /repository/PlaceRepository.js by API Key you've just coppied.

    ```
    const KEY_GG_MAP = "API_KEY_HERE";
    ```

**Note**: You also can extend the restrict of search nearby search by chage the "DEFAULT_RADIUS" default value is 3000. 

## Step 4: Connect with [OneSignal](https://documentation.onesignal.com/docs/onesignal-platform)

1. Login to OneSignal DashBoard and add your new app.

2. On your dashboard click to your app: Settings -> Keys & IDs

3. Coppy REST API KEY and ONESIGNAL APP ID 

4. Update value of REST_API_KEY, APP_ID from file /push_notification/NotificationController.js

>

    const host = "onesignal.com";
    var REST_API_KEY = "YOUR_REST_API_KEY";
    var APP_ID = "YOUR_APP_ID";
    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic " + REST_API_KEY
    };
    const app_id = APP_ID;

**Note**: You can see the [page](https://documentation.onesignal.com/reference#create-notification) to understand how to use REST API for push notification.

## Step 5: Run Project
- Install apk from (android app)[link repo]
- Run command

  ```    
    node app.js
  ```
