importScripts("https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.14.1/firebase-messaging.js");
// import {get_messaging} from "../src/messaging/init";

if (firebase.messaging.isSupported()) {
  console.log("hooooooooo");
  var firebaseConfig = {
    apiKey: "AIzaSyAr0_LjcEdJVsvhQD8SC6Aggl9gzfgsRjA",
    authDomain: "notif-demo-e8dae.firebaseapp.com",
    databaseURL: "https://notif-demo-e8dae.firebaseio.com",
    projectId: "notif-demo-e8dae",
    storageBucket: "notif-demo-e8dae.appspot.com",
    messagingSenderId: "356913468865",
    appId: "1:356913468865:web:52bba10aea1a12265a4b40",
    measurementId: "G-89JE5P29CZ"
     // messagingSenderId: "648404578436",
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const messaging = firebase.messaging();
  messaging.setBackgroundMessageHandler(function(payload) {
    console.log(' Received background message ', payload);
    // var sender = JSON.parse(payload.data.message);
    // var notificationTitle = payload.data.title;
    // var notificationOptions = {
    //   body: payload.data.body,
    // };
    // return self.registration.showNotification(
    //   notificationTitle,
    //   notificationOptions
    // );
  });
  self.addEventListener("notificationclick", function (event) {
    event.notification.close();
  });
} else {
  console.log("not supported");
}
