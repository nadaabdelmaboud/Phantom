import firebase from "firebase/app";
import "firebase/messaging";
import axios from "axios";
import store from "../store";

let messaging;
// Your web app's Firebase configuration
export function initializeFirebase() {
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
    messaging = firebase.messaging();
    messaging.onMessage(payload => {
      console.log("Message received. ", payload);
      store.commit("notifications/setCounter", 1);
      var notificationTitle = payload.data.title;
      var notificationOptions = {
        body: payload.data.body
      };
      new Notification(notificationTitle, notificationOptions);
    });
    Notification.requestPermission()
      .then(() => {
        console.log("Permission granted");
        var token = messaging.getToken({
          vapidKey:
            "BFz16iixT56m8aolUWzgrMMZN2Ybw_mOvNbnYb6e7-OlhpDSL6OPQr__fTWK_c6bBEhjcsrLrV34izdQhKDkGvY"
        });
        return token;
      })
      .then(token => {
        axios.defaults.headers.common["Authorization"] = localStorage.getItem(
          "userToken"
        );
        axios
          .put("me/" + token)
          .then(() => {
            console.log("token is senttt");
            store.dispatch("notifications/notifyUser");
          })
          .catch(error => {
            console.log("Error Occurred while sending token", error);
          });
      })
      .catch(error => {
        if (error.code === "messaging/permission-blocked") {
          console.log("Please Unblock Notification Request Manually");
        } else {
          console.log("Error Occurred", error);
        }
      });
  }
}
