import firebase from "firebase/app";
import "firebase/messaging";
import axios from "axios";
import store from "../store";

let messaging;
// Your web app's Firebase configuration
export function initializeFirebase() {
  if (firebase.messaging.isSupported()) {
    var firebaseConfig = {
      apiKey: process.env.VUE_APP_apiKey,
      authDomain: process.env.VUE_APP_authDomain,
      databaseURL: process.env.VUE_APP_databaseURL,
      projectId: process.env.VUE_APP_projectId,
      storageBucket: process.env.VUE_APP_storageBucket,
      messagingSenderId: process.env.VUE_APP_messagingSenderId,
      appId: process.env.VUE_APP_appId,
      measurementId: process.env.VUE_APP_measurementId
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
        messaging.usePublicVapidKey(
          "BEAsYWCI71bBMrKccjVrdKuz9Scwe-rfz4LJp21Q3AdKANNczGBnsb-CbeY_BHA6gq8wPyehUpWBUvpLhQqG28w"
        );
        var token = messaging.getToken();
        return token;
      })
      .then(token => {
        console.log(token);
        axios.defaults.headers.common["Authorization"] = localStorage.getItem(
          "userToken"
        );
        axios
          .put("me/" + token)
          .then(response => {
            console.log("response", response);
          })
          .catch(error => {
            console.log("Error Occurred", error);
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
