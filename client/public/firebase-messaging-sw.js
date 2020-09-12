importScripts("https://www.gstatic.com/firebasejs/7.19.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.19.1/firebase-messaging.js");
// import {get_messaging} from "../src/messaging/init";

if (firebase.messaging.isSupported()) {
  var firebaseConfig = {
      apiKey: "AIzaSyDJGcM4-rKBLozMQu1uJmTORQPnQKVkS_M",
      authDomain: "phantom-30457.firebaseapp.com",
      databaseURL: "https://phantom-30457.firebaseio.com",
      projectId: "phantom-30457",
      storageBucket: "phantom-30457.appspot.com",
      messagingSenderId: "822902693694",
      appId: "1:822902693694:web:c433556b3c92dcc483966f",
      measurementId: "G-BJ0XRKXP5E"
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
