import firebase from "firebase/app";
import "firebase/messaging";
import axios from "axios";
let messaging;

export function get_messaging() {
  return messaging;
}
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
      measurementId: "G-BJ0XRKXP5E",
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    messaging = firebase.messaging();
    messaging.onMessage((payload) => {
      console.log("Message received. ", payload);

      var notificationTitle = payload.data.title;
      var notificationOptions = {
        body: payload.data.body,
      };
      new Notification(notificationTitle, notificationOptions);
      // notification.onclick = function(event) {
      //   event.preventDefault(); // prevent the browser from focusing the Notification's tab
      //   window.open(payload.data.click_action, "_blank");
      //   notification.close();
      // };
    });
    messaging
      .requestPermission()
      .then(() => {
        console.log("Permission granted");
        messaging.usePublicVapidKey(
          "BEAsYWCI71bBMrKccjVrdKuz9Scwe-rfz4LJp21Q3AdKANNczGBnsb-CbeY_BHA6gq8wPyehUpWBUvpLhQqG28w"
        );
        var token = messaging.getToken();
        return token;
      })
      .then((token) => {
        console.log(token);
        axios.defaults.headers.common["Authorization"] = localStorage.getItem(
          "userToken"
        );
        axios
          .put("me/" + token)
          .then((response) => {
            console.log("response", response);
          })
          .catch((error) => {
            console.log("Error Occurred", error);
          });
      })
      .catch((error) => {
        if (error.code === "messaging/permission-blocked") {
          console.log("Please Unblock Notification Request Manually");
        } else {
          console.log("Error Occurred", error);
        }
      });
  }
}
