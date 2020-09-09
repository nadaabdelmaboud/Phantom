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
        type: "service_account",
        projectId: "phantom-286304",
        privateKeyId: "cf900f244489aa10a3e4287c2265467d2452c16f",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDK+yPqQ6u6xie5\ndT3LwhSbvC34Qw651BAzoBcA62RPBTFnkhj9rKgv9friolYO+MuBQtewBkTVwhpX\nefagJBe2zORUxs3mVt5JYqWBc51xQKnWhPJB15pC8KzSTtdoM0Uac7W2qQVmQWnD\nUEhSx2KxZnutbaleLehgowzfI4kAlLVJmTrQPTyatAASw2JD/GfWPIwpWrt+Re2q\nfpzLPTAc/g2uPFKfGd0CHflHwb//0skvjYz0luHKiNDMeVYyFRzpzBgBcIpEGwGi\n6PD1z1tHSNVaRPcl+ojpzPzuf6yJWK7cij+5ysiFNdPF745GRAZla0cgldLZ47aV\n7Kxt2NRJAgMBAAECggEAO9h42diS2NIUo0L0cc9qmRIN8az/uf1Su43fSmecnwm2\na8Vw9dYCjoV1L33SZr6m7ZkCE8V9ZRLCBnmQo92QWlalmXM2AMwq5LMfff/S8zGw\nAW4YKR6CvmrMYYNaUkAPh0GHWXATBfeSUcIpWLKtoAVJwLPc5EYfxeI86MtG2PL4\nSYfre4so4jAmyRgaZMWWFGrix+pj+9YCSy8Iuirsk3lF/ZYEsJREwjgpJWczFISD\n7tljWTedWtun4g/iK70681gH4pd9LQhDjYDnY9Ne8t+67pfiGopEgR+Xp20VT5fN\nD/nKR8aBmIwydCXedljUR+f7uBSLIVpUYGn6sAtjqwKBgQD61ViTMf1O0Hz7n0Op\nV1Cnu0lkujEW7PZhr9wM5dkHyqfclLEFp9LOXtULBMeZIXlMmfWJTFC0uFDnE27D\nJmObpOfH16QlY0ray9EUf4Y6vb8Ve2hFI3wgfAT6jsV9GfcT5/r6Ed2VD36IcHR8\n+n6K6UPGJwrdxokQm6EOC9x+wwKBgQDPKXeJqcEh1U2+/bY/eyKzO+gbyNdvcz4f\ndlCbLm4NFw6RuaR/CCg3UzeA8eWCqqh4VVHRy0cnz88DK770KhZirThEjJAzgZhA\n/xXV5OxGniGHxVWHSIq6jZBan7xZLFB49+1DKF6y1vi5NVJVKP1MQan58uG9po4y\nR4EzvinIAwKBgCt5lOuWS4BAlJkMJq8QKjOYO4VQ3DdMBPwzfeFiaTZ3gpax0ujX\nCKuqNiS9xFafPaXwPWV5q7dXBva2IImEetk8QMwbbSDpz8ySbP+vhrVhs9/mTtFE\n8Du1IyvGWSZwvKlfmNmFBTHTyKufSiFrTUmIWq3akICV66XMQ6LqnWH/AoGBALs7\nXy6snkFV586WwADf6ZzUqBN0kkHIhn0pEfEvJYfvLtvGTUYCuVZHgAKqniRa2ajo\nc+qJLuZsi0zyXMOQxmqo5BIQeMQUfOdBpRqMrH+mq+dqEsMSbU/uYmmFtVVjF9g9\nO9NWyUAZyvKZnrAZO9WQA3BEdIJT5nDK75s0Y87BAoGBAKcbyfkrVl6C3tTUe31M\nx1NLBxvsiyDAfiZGMUAbEf5QhB3HfmKzX3wSq+vf7HhPt1Uk38ZFr+NcF3E7hd1o\nh8LMoekWGzu8mY+8K+U3X1gtgbOZmMRVLqj+fU2KTobjzBcKZkXtA1XgWbcT/jiT\nJDUw6uIlL//LAAzqMvtzmcKo\n-----END PRIVATE KEY-----\n",
        clientEmail: "phantom@phantom-286304.iam.gserviceaccount.com",
        clientId: "100690891016453659830",
        authUri: "https://accounts.google.com/o/oauth2/auth",
        tokenUri: "https://oauth2.googleapis.com/token",
        authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
        clientC509CertUrl: "https://www.googleapis.com/robot/v1/metadata/x509/phantom%40phantom-286304.iam.gserviceaccount.com"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp({
        credential: firebase.credential.cert(firebaseConfig)
    });
    }
    messaging = firebase.messaging();
    messaging.onMessage((payload) => {
      console.log("Message received. ", payload);
      // var sender = JSON.parse(payload.data);
    //   var notificationTitle = payload.data.title;
    //   var notificationOptions = {
    //     body: payload.data.body,
    //   };
    //   var notification = new Notification(
    //     notificationTitle,
    //     notificationOptions
    //   );
    //   notification.onclick = function (event) {
    //     event.preventDefault(); // prevent the browser from focusing the Notification's tab
    //     window.open(payload.data.click_action, "_blank");
    //     notification.close();
    //   };
    });
    // messaging.usePublicVapidKey(
    //   "BMVdof5UoSTW4JmECt6UudHs0WITxpNyyBwAsAhr6ShO1ZAl6SYJHsKclwpD6X2xWiDYboDLGvicDJwb59oY9gU"
    // );
    messaging
      .requestPermission()
      .then(() => {
        console.log("Permission granted");
        var token = messaging.getToken();
        console.log("token dai", token);
        return token;
      })
      .then((token) => {
        console.log(token);
        axios.defaults.headers.common["Authorization"] = localStorage.getItem("userToken");;
        axios
          .put("api/me/"+token)
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
