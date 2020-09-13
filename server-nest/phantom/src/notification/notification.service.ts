import { Injectable } from '@nestjs/common';
import { ValidationService } from '../shared/validation.service';

import * as firebase from 'firebase-admin';

const params = {
  type: 'service_account',
  projectId: 'phantom-30457',
  privateKeyId: '7981418fbe2e57b0c762a3a90bff454eb029ae4d',
  privateKey:
    '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCmsAW07tzhfqKt\nDAd8JppRKyhJI5rHXI7rzRP+UYHHpGcE9cCGm/QaCIeZoHt7lWXHeOX8eGV9Sg0k\nhs4CbO/IVaFybXdhV7PFOpbCeHj8gjPjTzgxW8U0J6qVc601LiBkfEAdy0e5eTvi\nG8UXoKa6E1vBP/5vE25JMfWAv9WP+9OWOtSPiTQF6GUZbRginEkrVM1oPK8dgAzj\nV06Tgpg2g6cqfBNyV3jk9+flekWtX3/C3asal3orV8bfKpWpDyZtUcbNc/xCuDzk\n9EFoieSt9kLW4zun2EaQLIEwg3+PQcuCZrbcaqf4pAa4/UoIFdvvkyq2BLAIg5uG\nn3cKwu9xAgMBAAECggEAAoGCcHQn128BMJNN+ICXENHShvj1Tnp2fpaEbq4YgqEW\n2GT+ajelfY+zxCw8twCpuUw4vukrc2z90hcBuVkcaLla1j7NjOXV4sjs88r+XKNz\ndr8d4+YSiqRvBNSqnbJOE9ynVRtVfnUTYKSUu7RzVThNyJO29kIHRivtWixoIEQ9\ncJ+WJAfcAhulIZToBYMxHEyL3TJ5KzDEqt89QYlcNzOC1BWxtGVFLaEFVk3bcFLJ\niMY0cNKDTJ6N6QkyBHVURU0OUTqRajWSEU5we1q9MSwImcbRH/eh1cu8t+gm6UCR\nz1qN+Hd+UQpSNyvcTCcjcvl0a+HCBWacA3vrxe6HLQKBgQDf6M3qRQjT+fOMvK/m\nR4fe+qe6PF6awBFXz9mrOSLcNePvJSVfUK0OXaomZ259pClftuDSQNhr9LeU7rH0\nYBoWdrCLUgALmIdH1szha+3qRGZJWnRuUIfR2/QPzbiSH1mEX12zuGOf0O2mJns1\nJP/LudMTlzQss1sNM0hEdU2u5QKBgQC+k8KXX74j52j+PSjeVzloss+4XJA6xxId\nKuZh3la0YulfpyS9l5I7hmhVH2qfQqQBoWTrSqfVeHdkxzIBtTemX2MqpikBi/1O\n/UNMCIESy3XromPI6j9sV9TLHuFSBGgZbR9nTPXfzq8ZtHYjLKKr0f/oANJ8qmoe\n9ohN1uwpnQKBgQCqZk6G8eClCXyK53HqCxfg3trUhWrt1Cueq0SY5NOdyLldXuSR\nJCF/ZFLABUj1/v+potB30feiOMuZYQo20wgnfk4eyNnV+U9Cobqr9upJtaIuQtOG\nvGyQjhawDDxhn9ANSFJUGohesK6bGn/7UtwEW7fCGfkP57LsWdGun6Lt7QKBgQC5\n47zaFEyODumtm5Bil6fqxQeyJ6+TdZvokXDYo5vlJdnHMGy49cBwiWD5LsS8ha8d\n3ARpMY/VvESRK29OlSmsAbzj2+GBnb++LXFYF6922rix19sHHd4xWta4Le3QJ3Y2\n3ubTxxDJdnv7UbguBRrDB/panXqymTMb8pLvgiUnTQKBgQCzZYGr7S53XDdrpbCs\njLXj5+EA63bPfqsQwUJcWWnj8DjaZ2Frn4bWeKBX0ebthHvInxliHWXAOoYiR4sg\nxZfedKIvcjO/TLve7iSfFBjKBB3LihDJ974M3nxAITHuCptp4xjTGUh0yPeI0u50\ncmXmuUBAK738LxpeBL0zea4Ofw==\n-----END PRIVATE KEY-----\n',
  clientEmail: 'firebase-adminsdk-xzh9e@phantom-30457.iam.gserviceaccount.com',
  clientId: '114806940192433175805',
  authUri: 'https://accounts.google.com/o/oauth2/auth',
  tokenUri: 'https://oauth2.googleapis.com/token',
  authProviderX509CertUrl: 'https://www.googleapis.com/oauth2/v1/certs',
  clientX509CertUrl:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xzh9e%40phantom-30457.iam.gserviceaccount.com',
};
let app = firebase.initializeApp({
  credential: firebase.credential.cert(params),
});
@Injectable()
export class NotificationService {
  constructor() { }
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
          console.log('Yaay Message has been sent successfully');
        }
      })
      .catch(err => {
        console.log(err);
      });
    return notSendTokens;
  }

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

  async followUser(followedUser, followerUser) {
    let message: {
      data: {
        followerImageId: string;
        followerId: string;
        title: string;
        body: string;
        time: string;
      };
      tokens?: [string];
    } = {
      data: {
        followerImageId: String(followerUser.profileImage),
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
    //console.log(message);
    followedUser.notificationCounter = followedUser.notificationCounter
      ? followedUser.notificationCounter + 1
      : 1;
    if (!followedUser.notifications) followedUser.notifications = [];
    followedUser.notifications = await this.addTolimitedArray(followedUser.notifications, 30, message);
    if (!followedUser.fcmToken || followedUser.fcmToken == ' ') {
      if (!followedUser.offlineNotifications)
        followedUser.offlineNotifications = [];
      followedUser.offlineNotifications = await this.addTolimitedArray(followedUser.offlineNotifications, 30, message);
    } else {
      message.tokens = [followedUser.fcmToken];
      let checkFailed = await this.sendNotification(
        [followedUser.fcmToken],
        message,
      );
      if (checkFailed.length > 0) {
        message.tokens = null;
        followedUser.offlineNotifications.push(message);
      }
    }
    return {
      offlineNotifications: followedUser.offlineNotifications,
      notifications: followedUser.notifications,
      notificationCounter: followedUser.notificationCounter,
    };
  }

  async unfollowUser(followedUser, followerUser) {
    let message: {
      data: {
        followerImageId: string;
        followerId: string;
        title: string;
        body: string;
        time?: string;
      };
      tokens?: [string];
    } = {
      data: {
        followerImageId: String(followerUser.profileImage),
        followerId: String(followerUser._id),
        title: 'your follower increase ',
        body:
          followerUser.firstName +
          ' ' +
          followerUser.lastName +
          ' has followed You 😮',
        time: undefined,
      },
    };
    let notificationData = followedUser.offlineNotifications;
    if (!followedUser.offlineNotifications)
      followedUser.offlineNotifications = [];
    // console.log(followedUser.offlineNotifications);
    //console.log(100);

    for (let i = 0; i < notificationData.length; i++) {
      notificationData[i].data.time = undefined;
      if (
        message.data.followerId == notificationData[i].data.followerId &&
        notificationData[i].data.title == 'your follower increase '
      ) {
        followedUser.offlineNotifications.splice(i, 1);
      }
    }
    //console.log(followedUser.offlineNotifications);
    //console.log(100);
    if (!followedUser.notifications) followedUser.notifications = [];
    notificationData = followedUser.notifications;
    //console.log(followedUser.notifications);

    for (let i = 0; i < notificationData.length; i++) {
      notificationData[i].data.time = undefined;
      if (
        message.data.followerId == notificationData[i].data.followerId &&
        notificationData[i].data.title == 'your follower increase '
      ) {
        followedUser.notifications.splice(i, 1);
      }
    }
    // console.log(100);

    //console.log(followedUser.notifications);
    return {
      offlineNotifications: followedUser.offlineNotifications,
      notifications: followedUser.notifications,
      notificationCounter: followedUser.notificationCounter,
    };
  }

  async followBoard(ownerUser, followerUser, boardName, boardId) {
    let message: {
      data: {
        followerImageId: string;
        followerId: string;
        boardId: string;
        title: string;
        body: string;
        time: string;
      };
      tokens?: [string];
    } = {
      data: {
        time: Date.now().toString(),
        followerImageId: String(followerUser.profileImage),
        followerId: String(followerUser._id),
        boardId: boardId,
        title: '😮 your board is followed',
        body:
          followerUser.firstName +
          ' ' +
          followerUser.lastName +
          ' has followed Your board ' +
          '"' +
          boardName +
          '"',
      },
    };
    ownerUser.notificationCounter = ownerUser.notificationCounter
      ? ownerUser.notificationCounter + 1
      : 1;
    await ownerUser.save();
    if (!ownerUser.notifications) ownerUser.notifications = [];
    ownerUser.notifications.push(message);
    if (!ownerUser.fcmToken || ownerUser.fcmToken == ' ') {
      if (!ownerUser.offlineNotifications) ownerUser.offlineNotifications = [];
      ownerUser.offlineNotifications.push(message);
      await ownerUser.save();
    } else {
      message.tokens = [ownerUser.fcmToken];
      let checkFailed = await this.sendNotification(
        [ownerUser.fcmToken],
        message,
      );
      if (checkFailed.length > 0) {
        message.tokens = null;
        ownerUser.offlineNotifications.push(message);
      }
    }
    await ownerUser.save();
    return 1;
  }

  async commentPin(ownerUser, commenterUser, comment, pinName, pinId, imageId) {
    let message: {
      data: {
        time: string;
        commenterImageId: string;
        commenterId: string;
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
        commenterId: String(commenterUser._id),
        imageLink: 'http://localhost:3000/image/' + imageId,
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
    ownerUser.notifications.push(message);
    if (!ownerUser.fcmToken || ownerUser.fcmToken == ' ') {
      if (!ownerUser.offlineNotifications) ownerUser.offlineNotifications = [];
      ownerUser.offlineNotifications.push(message);
      await ownerUser.save();
    } else {
      message.tokens = [ownerUser.fcmToken];
      let checkFailed = await this.sendNotification(
        [ownerUser.fcmToken],
        message,
      );
      if (checkFailed.length > 0) {
        message.tokens = null;
        ownerUser.offlineNotifications.push(message);
      }
      await ownerUser.save();
    }
    await ownerUser.save();
    return 1;
  }

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
        userId: String(reactUser._id),
        imageLink: 'http://localhost:3000/image/' + imageId,
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
    ownerUser.notifications.push(message);
    if (!ownerUser.fcmToken || ownerUser.fcmToken == ' ') {
      if (!ownerUser.offlineNotifications) ownerUser.offlineNotifications = [];
      ownerUser.offlineNotifications.push(message);
      await ownerUser.save();
    } else {
      message.tokens = [ownerUser.fcmToken];
      let checkFailed = await this.sendNotification(
        [ownerUser.fcmToken],
        message,
      );
      if (checkFailed.length > 0) {
        message.tokens = null;
        ownerUser.offlineNotifications.push(message);
      }
      await ownerUser.save();
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
    user.notifications.push(arrayMessage);

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
          user.notifications.push(arrayMessage);
        }
        await user.save();
        return 0;
      }
    }

    await user.save();
    return 1;
  }

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
    user.notifications.push(arrayMessage);
    await user.save();
    //console.log('aywa');
    //console.log(user.fcmToken);
    if (!user.fcmToken || user.fcmToken == ' ') {
      return 0;
    } else {
      await user.save().catch(err => {
        console.log(err);
      });
      message = {
        data: {
          title: 'Popular Phantom Pins!',
          body: 'check out these popular pins on phantom',
        },
        tokens: [user.fcmToken],
      };

      let checkFailed = await this.sendNotification([user.fcmToken], message);

      if (checkFailed.length > 0) {
        let last = user.notifications.pop();
        if (String(last.title) != String(arrayMessage.title)) {
          user.notifications.push(arrayMessage);
        }
        await user.save().catch(err => {
          console.log(err);
        });

        return 0;
      }
    }
    return 1;
  }
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
    user.notifications.push(arrayMessage);
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
          user.notifications.push(arrayMessage);
        }
        await user.save();
        return 0;
      }
    }
    return 1;
  }
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
    user.notifications.push(arrayMessage);

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
          user.notifications.push(arrayMessage);
        }
        await user.save();
        return 0;
      }
    }
    return 1;
  }
  async addTolimitedArray(notificationArray: Array<any>, limit: number, pushedData: {}) {
    if (notificationArray.length >= limit) {
      notificationArray = notificationArray.slice(0, limit - 1);
    }
    notificationArray.push(pushedData);
    return notificationArray;
  }
}


