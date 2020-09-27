import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
const params = {
  type: String(process.env.FIREBASE_CREADENTIAL_TYPE),
  projectId: String(process.env.FIREBASE_CREADENTIAL_PROJECT_ID),
  privateKeyId: String(process.env.FIREBASE_CREADENTIAL_PRIVATE_KEY_ID),
  privateKey: String(
    process.env.FIREBASE_CREADENTIAL_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ),
  clientEmail: String(process.env.FIREBASE_CREADENTIAL_CLIENT_ID),
  clientId: String(process.env.FIREBASE_CREADENTIAL_CLIENT_EMAIL),
  authUri: String(process.env.FIREBASE_CREADENTIAL_AUTH_URI),
  tokenUri: String(process.env.FIREBASE_CREADENTIAL_TOKEN_URI),
  authProviderX509CertUrl: String(
    process.env.FIREBASE_CREADENTIAL_AUTH_PROVIDER_X509_CERT_URL,
  ),
  clientX509CertUrl: String(
    process.env.FIREBASE_CREADENTIAL_CLIENT_X509_CERT_URL,
  ),
};
let app = firebase.initializeApp({
  credential: firebase.credential.cert(params),
});
/**
 * @module Notification
 */
@Injectable()
export class NotificationService {
  constructor() {}

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @descriptionsendNotification : send one notification to client
   * @param {Array<String>} tokens  - array of fcm tokens wanted to send this massage to
   * @param {Object} message - message needed  to send
   * @returns {Array<String>}array of not send notification
   */
  async sendNotification(tokens, message) {
    const notSendTokens = [];
    app
      .messaging()
      .sendMulticast(message)
      .then(response => {
        if (response.failureCount > 0) {
          response.responses.forEach((res, id) => {
            if (!res.success) {
              notSendTokens.push(tokens[id]);
            }
          });
        } else {
          console.log('Message has been sent successfully');
        }
      })
      .catch(err => {
        console.log(err);
      });
    return notSendTokens;
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @descriptionsendOfflineNotification :send array of massages & notification
   * @param {Array<Object>}messages - array of massages wented to send
   * @param {String} fcmToken - fcm token needed to send to
   */
  async sendOfflineNotification(messages, fcmToken) {
    if (!messages || messages.length == 0) return;
    for (let i = 0; i < messages.length; i++) messages[i].token = fcmToken;
    app
      .messaging()
      .sendAll(messages)
      .then(response => {
        console.log(response.successCount + ' messages were sent successfully');
      });
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @descriptionsend notification to user when some one follow hem
   * @param {Object of User type} followedUser - user who is followed
   * @param {Object of User type} followerUser -user who follow
   * @returns {Object} -new changes of user
   */
  async followUser(followedUser, followerUser) {
    let message: {
      data: {
        followerImageId: string;
        followerId: string;
        title: string;
        google: string;
        googleImage: string;
        body: string;
        time: string;
      };
      tokens?: [string];
    } = {
      data: {
        followerImageId: String(followerUser.profileImage),
        google: String(followerUser.google),
        googleImage: String(followerUser.googleImage),
        followerId: String(followerUser._id),
        title: 'your follower increase ',
        body:
          followerUser.firstName +
          ' ' +
          followerUser.lastName +
          ' has followed You 😮',
        time: Date.now().toString(),
      },
    };
    followedUser.notificationCounter = followedUser.notificationCounter
      ? followedUser.notificationCounter + 1
      : 1;
    if (!followedUser.notifications) followedUser.notifications = [];
    followedUser.notifications = await this.addTolimitedArray(
      followedUser.notifications,
      30,
      message,
    );
    console.log("sendingqe")
    if (!followedUser.fcmToken || followedUser.fcmToken == ' ') {
        console.log("brg3")
      if (!followedUser.offlineNotifications)
        followedUser.offlineNotifications = [];
      followedUser.offlineNotifications = await this.addTolimitedArray(
        followedUser.offlineNotifications,
        30,
        message,
      );
    } else {
      message.tokens = [followedUser.fcmToken];
      console.log("sendingwe")
      let checkFailed = await this.sendNotification(
        [followedUser.fcmToken],
        message,
      );
      if (checkFailed.length > 0) {
        message.tokens = null;
        followedUser.offlineNotifications = await this.addTolimitedArray(
          followedUser.offlineNotifications,
          30,
          message,
        );
      }
    }
    return {
      offlineNotifications: followedUser.offlineNotifications,
      notifications: followedUser.notifications,
      notificationCounter: followedUser.notificationCounter,
    };
  }
  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @descriptiondelete follow message from notification history
   * @param {Object of User type} followedUser - user who is followed
   * @param {Object of User type} followerUser -user who follow
   * @returns {Object} -new changes of user
   */
  async unfollowUser(followedUser, followerUser) {
    let message: {
      data: {
        followerImageId: string;
        followerId: string;
        google: string;
        googleImage: string;
        title: string;
        body: string;
        time?: string;
      };
      tokens?: [string];
    } = {
      data: {
        followerImageId: String(followerUser.profileImage),
        google: String(followerUser.google),
        googleImage: String(followerUser.googleImage),
        followerId: String(followerUser._id),
        title: 'your follower increase ',
        body:
          followerUser.firstName +
          ' ' +
          followerUser.lastName +
          ' has followed You 😮',
        time: null,
      },
    };
    let notificationData = followedUser.offlineNotifications;
    if (!followedUser.offlineNotifications)
      followedUser.offlineNotifications = [];

    for (let i = 0; i < followedUser.offlineNotifications.length; i++) {
      if (followedUser.offlineNotifications[i].data)
        if (
          followedUser.offlineNotifications[i].data.title ==
            'your follower increase ' &&
          message.data.followerId ==
            followedUser.offlineNotifications[i].data.followerId
        ) {
          followedUser.offlineNotifications.splice(i, 1);
          i--;
        }
    }

    if (!followedUser.notifications) followedUser.notifications = [];
    notificationData = followedUser.notifications;

    for (let i = 0; i < followedUser.notifications.length; i++) {
      if (followedUser.notifications[i].data)
        if (
          followedUser.notifications[i].data.title ==
            'your follower increase ' &&
          message.data.followerId ==
            followedUser.notifications[i].data.followerId
        ) {
          followedUser.notifications.splice(i, 1);
          i--;
        }
    }

    return {
      offlineNotifications: followedUser.offlineNotifications,
      notifications: followedUser.notifications,
      notificationCounter: followedUser.notificationCounter,
    };
  }
  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @descriptionsend notification when some one comment in user pin
   * @param {Object of user type} ownerUser - user who has pin
   * @param  {Object of user type} commenterUser - user who comment in pin
   * @param {String} comment - comment
   * @param {String} pinName - title of pin
   * @param {String} pinId - the id of this pin
   * @param {String} imageId - the id of pin image
   * @returns {Number} 1
   */
  async commentPin(ownerUser, commenterUser, comment, pinName, pinId, imageId) {
    let message: {
      data: {
        time: string;
        commenterImageId: string;
        commenterId: string;
        google: string;
        googleImage: string;
        imageLink: string;
        pinId: string;
        title: string;
        body: string;
      };
      tokens?: [string];
    } = {
      data: {
        time: Date.now().toString(),
        commenterImageId: String(commenterUser.profileImage),
        google: String(commenterUser.google),
        googleImage: String(commenterUser.googleImage),
        commenterId: String(commenterUser._id),
        imageLink: String(process.env.FRONT_BASE_URL) + '/image/' + imageId,
        pinId: pinId,
        title: '📝 Comment on your pin',
        body:
          commenterUser.firstName +
          ' ' +
          commenterUser.lastName +
          ' has comment on your pin' +
          '"' +
          pinName +
          '"' +
          'say that' +
          comment,
      },
    };
    ownerUser.notificationCounter = ownerUser.notificationCounter
      ? ownerUser.notificationCounter + 1
      : 1;
    await ownerUser.save();
    if (!ownerUser.notifications) ownerUser.notifications = [];
    ownerUser.notifications = await this.addTolimitedArray(
      ownerUser.notifications,
      30,
      message,
    );

    if (!ownerUser.fcmToken || ownerUser.fcmToken == ' ') {
      if (!ownerUser.offlineNotifications) ownerUser.offlineNotifications = [];
      ownerUser.offlineNotifications = await this.addTolimitedArray(
        ownerUser.offlineNotifications,
        30,
        message,
      );
      await ownerUser.save();
    } else {
      message.tokens = [ownerUser.fcmToken];
      let checkFailed = await this.sendNotification(
        [ownerUser.fcmToken],
        message,
      );
      if (checkFailed.length > 0) {
        message.tokens = null;
        ownerUser.offlineNotifications = await this.addTolimitedArray(
          ownerUser.offlineNotifications,
          30,
          message,
        );
      }
      await ownerUser.save();
    }
    await ownerUser.save();
    return 1;
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description notification to pin owner when someone react to pin
   * @param {Object of user type} ownerUser - user who has pin
   * @param  {Object of user type} reactUser - user who react in pin
   * @param {String} react - type of react
   * @param {String} pinName - title of pin
   * @param {String} pinId - the id of this pin
   * @param {String} imageId - the id of pin image
   * @returns {Number} 1
   */
  async reactPin(ownerUser, reactUser, pinName, pinId, react, imageId) {
    if (react == 'Love') react = '💖';
    else if (react == 'Good idea') react = '👍';
    else if (react == 'Thanks') react = '🙆‍♀️';
    else if (react == 'Haha') react = '😄';
    else if (react == 'Wow') react = '😮';

    let message: {
      data: {
        time: string;
        userImageId: string;
        userId: string;
        google: string;
        googleImage: string;
        imageLink: string;
        pinId: string;
        title: string;
        body: string;
      };
      tokens?: [string];
    } = {
      data: {
        time: Date.now().toString(),
        userImageId: String(reactUser.profileImage),
        google: String(reactUser.google),
        googleImage: String(reactUser.googleImage),
        userId: String(reactUser._id),
        imageLink: String(process.env.FRONT_BASE_URL) + '/image/' + imageId,
        pinId: pinId,
        title: react + ' React on your pin',
        body:
          reactUser.firstName +
          ' ' +
          reactUser.lastName +
          ' has react on your pin' +
          '"' +
          pinName +
          '"',
      },
    };
    ownerUser.notificationCounter = ownerUser.notificationCounter
      ? ownerUser.notificationCounter + 1
      : 1;
    await ownerUser.save();
    if (!ownerUser.notifications) ownerUser.notifications = [];
    ownerUser.notifications = await this.addTolimitedArray(
      ownerUser.notifications,
      30,
      message,
    );

    if (!ownerUser.fcmToken || ownerUser.fcmToken == ' ') {
      if (!ownerUser.offlineNotifications) ownerUser.offlineNotifications = [];
      ownerUser.offlineNotifications = await this.addTolimitedArray(
        ownerUser.offlineNotifications,
        30,
        message,
      );
      await ownerUser.save();
    } else {
      message.tokens = [ownerUser.fcmToken];
      let checkFailed = await this.sendNotification(
        [ownerUser.fcmToken],
        message,
      );
      if (checkFailed.length > 0) {
        message.tokens = null;
        ownerUser.offlineNotifications = await this.addTolimitedArray(
          ownerUser.offlineNotifications,
          30,
          message,
        );
      }
      await ownerUser.save();
    }
    await ownerUser.save();
    return 1;
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description delete react from user history when unreact
   * @param {Object of user type} ownerUser - user who has pin
   * @param  {Object of user type} reactUser - user who unreact in pin
   * @param {String} react - type of react
   * @param {String} pinName - title of pin
   * @param {String} pinId - the id of this pin
   * @param {String} imageId - the id of pin image
   * @returns {Number} 1
   */
  async unreactPin(ownerUser, reactUser, pinName, pinId, react, imageId) {
    if (react == 'Love') react = '💖';
    else if (react == 'Good idea') react = '👍';
    else if (react == 'Thanks') react = '🙆‍♀️';
    else if (react == 'Haha') react = '😄';
    else if (react == 'Wow') react = '😮';

    let notificationData = ownerUser.offlineNotifications;
    if (!ownerUser.offlineNotifications) ownerUser.offlineNotifications = [];

    for (let i = 0; i < notificationData.length; i++) {
      if (notificationData[i].data)
        if (
          notificationData[i].data.userId == reactUser._id &&
          notificationData[i].data.pinId == pinId &&
          notificationData[i].data.title == react + ' React on your pin'
        ) {
          ownerUser.offlineNotifications.splice(i, 1);
          i--;
        }
    }
    if (!ownerUser.notifications) ownerUser.notifications = [];
    notificationData = ownerUser.notifications;
    for (let i = 0; i < notificationData.length; i++) {
      if (notificationData[i].data)
        if (
          notificationData[i].data.userId == reactUser._id &&
          notificationData[i].data.pinId == pinId &&
          notificationData[i].data.title == react + ' React on your pin'
        ) {
          ownerUser.notifications.splice(i, 1);
          i--;
        }
    }
    await ownerUser.save();
    return 1;
  }

  async boardsForYou(user, boards, images) {
    let arrayMessage = {
      boards: boards,
      images: images,
      time: Date.now(),
      title: 'Boards For You!',
      body: 'we think that you may get interested in some of these boards',
    };
    let message;
    user.notificationCounter = user.notificationCounter
      ? user.notificationCounter + 1
      : 1;
    if (!user.notifications) user.notifications = [];
    user.notifications = await this.addTolimitedArray(
      user.notifications,
      30,
      arrayMessage,
    );
    await user.save();

    if (!user.fcmToken || user.fcmToken == ' ') {
      return 0;
    } else {
      await user.save();
      message = {
        data: {
          title: 'Boards For You!',
          body: 'we think that you may get interested in some of these boards',
        },
        tokens: [user.fcmToken],
      };

      let checkFailed = await this.sendNotification([user.fcmToken], message);
      if (checkFailed.length > 0) {
        let last = user.notifications.pop();
        if (String(last.title) != String(arrayMessage.title)) {
          user.notifications = await this.addTolimitedArray(
            user.notifications,
            30,
            arrayMessage,
          );
        }
        await user.save();
        return 0;
      }
    }
    await user.save();
    return 1;
  }

  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @descriptionsend popular pin notification to user
   * @param {Object of user type }user - user object
   * @param {Array<Object>} pins
   * @param {Array<ids>} images
   * @returns {Number}
   */
  async popularPins(user, pins, images) {
    let arrayMessage = {
      pins: pins,
      images: images,
      title: 'Popular Phantom Pins!',
      time: Date.now(),
      body: 'check out these popular pins on phantom',
    };
    let message;
    user.notificationCounter = user.notificationCounter
      ? user.notificationCounter + 1
      : 1;
    if (!user.notifications) user.notifications = [];
    user.notifications = await this.addTolimitedArray(
      user.notifications,
      30,
      arrayMessage,
    );
    console.log("sendingqe")
    await user.save();
    console.log("sendingwe")
    if (!user.fcmToken || user.fcmToken == ' ') {
      console.log("brg3")
      return 0;
    } else {
      await user.save().catch(err => {
        //  console.log(err);
      });
      message = {
        data: {
          title: 'Popular Phantom Pins!',
          body: 'check out these popular pins on phantom',
        },
        tokens: [user.fcmToken],
      };
      console.log("sending")
      let checkFailed = await this.sendNotification([user.fcmToken], message);
      console.log("sending2")
      if (checkFailed.length > 0) {
        console.log("sending3")
        let last = user.notifications.pop();
        if (String(last.title) != String(arrayMessage.title)) {
          user.notifications = await this.addTolimitedArray(
            user.notifications,
            30,
            arrayMessage,
          );
        }
        await user.save().catch(err => {
          // console.log(err);
        });
        return 0;
      }
    }
    console.log("sending4")
    return 1;
  }

  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description  send pins for certan user notification to user
   * @param {Object of user type }user - user object
   * @param {Array<Object>} pins
   * @param {Array<ids>} images
   * @returns {Number}
   */
  async pinsForYou(user, pins, images) {
    let arrayMessage = {
      pins: pins,
      images: images,
      time: Date.now(),
      title: 'Pins For You!',
      body: 'We think that you may get instersted in some of these pins',
    };
    let message;
    user.notificationCounter = user.notificationCounter
      ? user.notificationCounter + 1
      : 1;
    if (!user.notifications) user.notifications = [];
    user.notifications = await this.addTolimitedArray(
      user.notifications,
      30,
      arrayMessage,
    );
    await user.save();
    if (!user.fcmToken || user.fcmToken == ' ') {
      return 0;
    } else {
      await user.save();
      message = {
        data: {
          title: 'Pins For You!',
          body: 'We think that you may get instersted in some of these pins',
        },
        tokens: [user.fcmToken],
      };
      let checkFailed = await this.sendNotification([user.fcmToken], message);
      if (checkFailed.length > 0) {
        let last = user.notifications.pop();
        if (String(last.title) != String(arrayMessage.title)) {
          user.notifications = await this.addTolimitedArray(
            user.notifications,
            30,
            arrayMessage,
          );
        }
        await user.save();
        return 0;
      }
    }
    return 1;
  }

  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description send popular inspired notification to user
   * @param {Object of user type }user - user object
   * @param {Array<Object>} pins
   * @param {Array<ids>} images
   * @returns {Number}
   */
  async pinsInspired(user, pins, images) {
    let arrayMessage = {
      pins: pins,
      images: images,
      time: Date.now(),
      title: 'Pins Inspired By Your Recent Activity!',
      body: 'check out these pins',
    };
    let message;
    user.notificationCounter = user.notificationCounter
      ? user.notificationCounter + 1
      : 1;
    if (!user.notifications) user.notifications = [];
    user.notifications = await this.addTolimitedArray(
      user.notifications,
      30,
      arrayMessage,
    );
    await user.save();
    if (!user.fcmToken || user.fcmToken == ' ') {
      return 0;
    } else {
      await user.save();
      message = {
        data: {
          title: 'Pins Inspired By Your Recent Activity!',
          body: 'check out these pins',
        },
        tokens: [String(user.fcmToken)],
      };
      let checkFailed = await this.sendNotification([user.fcmToken], message);
      if (checkFailed.length > 0) {
        let last = user.notifications.pop(message);
        if (String(last.title) != String(arrayMessage.title)) {
          user.notifications = await this.addTolimitedArray(
            user.notifications,
            30,
            arrayMessage,
          );
        }
        await user.save();
        return 0;
      }
    }
    return 1;
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @descriptionthis function add to array but this array has limit
   * @param {Array<Object>} notificationArray -array of data
   * @param {Number} limit  - the limit should be
   * @param {Object} pushedData Data should add to array
   * @returns {Array<Object>} after delete
   */
  async addTolimitedArray(
    notificationArray: Array<any>,
    limit: number,
    pushedData: {},
  ) {
    if (notificationArray.length >= limit) {
      notificationArray.splice(0, 1);
    }
    notificationArray.push(pushedData);
    return notificationArray;
  }
}
