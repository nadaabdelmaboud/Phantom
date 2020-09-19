import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from './user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { pin } from '../types/pin';
import { user } from '../types/user';
import { ChatService } from 'src/chat/chat.service';
import { time } from 'console';
const jwt = require('jsonwebtoken');
@WebSocketGateway()
export class SharedGateway {
  constructor(
    private ChatService: ChatService,
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    @InjectModel('User') private readonly userModel: Model<user>,
  ) { }
  @SubscribeMessage('setUserId')
  async setUserId(socket: Socket, data: any) {
    const token = data.token;
    const decoded = await jwt.verify(token, process.env.jwtsecret);
    let userId = decoded._id;
    let user = await this.userModel.findById(userId, { socketId: 1 });
    if (user) {
      console.log('user', socket.id);
      user.socketId = socket.id;
      await user.save();
    }
  }
  @SubscribeMessage('comment')
  async comment(socket: Socket, data: any) {
    let commentText = data.commentText;
    let token = data.token;
    token = token.substring(7);
    const decoded = await jwt.verify(token, process.env.jwtsecret);
    let commenterId = decoded._id;
    let commenter = await this.userModel.findById(commenterId, {
      firstName: 1,
      lastName: 1,
      profileImage: 1,
    });
    if (commenter && commentText) {
      socket.emit('sendComment', {
        commentText: data.commentText,
        commenterName: commenter.firstName + ' ' + commenter.lastName,
        commenterImage: commenter.profileImage,
        pinId: data.pinId,
        date: Date.now(),
      });
    }

  }
  @SubscribeMessage('typing')
  async type(socket: Socket, data: any) {
    let senderId = data.senderId;
    let sender = await this.userModel.findById(senderId);
    let recieverId = data.recieverId;
    let reciever = await this.userModel.findById(recieverId);
    if (sender && reciever) {
      console.log("sending")
      socket.to(reciever.socketId).emit('isTyping', {
        recieverImage: reciever.profileImage,
        senderImage: sender.profileImage,
        recieverName: reciever.firstName + ' ' + reciever.lastName,
        senderName: sender.firstName + ' ' + sender.lastName,
        senderId: data.senderId,
      });
    }
  }
  @SubscribeMessage('delivered')
  async deliver(socket: Socket, data: any) {
    let senderId = data.senderId;
    let sender = await this.userModel.findById(senderId);
    let recieverId = data.recieverId;
    let reciever = await this.userModel.findById(recieverId);
    let messageId = data.messageId;
    if (sender && reciever) {
      socket.to(reciever.socketId).emit('setDelivered', {
        recieverImage: reciever.profileImage,
        senderImage: sender.profileImage,
        recieverName: reciever.firstName + ' ' + reciever.lastName,
        senderName: sender.firstName + ' ' + sender.lastName,
        senderId: data.senderId,
        messageId: data.messageId,
      });
    await this.ChatService.deliver(recieverId, messageId, true);

    }
  }
  @SubscribeMessage('seen')
  async seenMessage(socket: Socket, data: any) {
    let senderId = data.senderId;
    let sender = await this.userModel.findById(senderId);
    let recieverId = data.recieverId;
    let reciever = await this.userModel.findById(recieverId);
    let messageId = data.messageId;
    if (sender && reciever) {
      socket.to(reciever.socketId).emit('setSeen', {
        recieverImage: reciever.profileImage,
        senderImage: sender.profileImage,
        recieverName: reciever.firstName + ' ' + reciever.lastName,
        senderName: sender.firstName + ' ' + sender.lastName,
        senderId: data.senderId,
        messageId: data.messageId,
      });
    await this.ChatService.seen(recieverId, messageId, true);

    }
  }
  @SubscribeMessage('message')
  async message(socket: Socket, data: any) {
    let messageText = data.message;
    let senderId = data.senderId;
    let sender = await this.userModel.findById(senderId);
    let recieverId = data.recieverId;
    let reciever = await this.userModel.findById(recieverId);
    if (sender && reciever && messageText) {
      socket.to(reciever.socketId).emit('sendMessage', {
        recieverImage: reciever.profileImage,
        senderImage: sender.profileImage,
        recieverName: reciever.firstName + ' ' + reciever.lastName,
        senderName: sender.firstName + ' ' + sender.lastName,
        message: messageText,
        senderId: data.senderId,
        date: Date.now(),
      });
    }
  }

  @SubscribeMessage('reply')
  async reply(socket: Socket, data: any) {
    let replyText = data.replyText;
    let commentId = data.commentId;
    const token = data.token;
    const decoded = await jwt.verify(token, process.env.jwtsecret);
    let replierId = decoded._id;
    let replier = await this.userModel.findById(replierId, {
      firstName: 1,
      lastName: 1,
      profileImage: 1,
    });
    if (replier && replyText) {
      socket.emit('sendReply', {
        replyText: replyText,
        replierName: replier.firstName + ' ' + replier.lastName,
        replierImage: replier.profileImage,
        pinId: data.pinId,
        commentId: commentId,
        date: Date.now(),
      });
    }
  }

  @SubscribeMessage('reactPin')
  async reactPin(socket: Socket, data: any) {
    const token = data.token;
    const decoded = await jwt.verify(token, process.env.jwtsecret);
    let userId = decoded._id;
    let user = await this.userModel.findById(userId, {
      firstName: 1,
      lastName: 1,
      profileImage: 1,
    });
    let pin = await this.pinModel.findById(data.pinId, { counts: 1 });
    socket.emit('sendPinReact', {
      reactType: data.reactType,
      userName: user.firstName + ' ' + user.lastName,
      userImage: user.profileImage,
      pinId: data.pinId,
      wowReacts:
        data.reactType == 'Wow'
          ? pin.counts.wowReacts.valueOf() + 1
          : pin.counts.wowReacts,
      loveReacts:
        data.reactType == 'Love'
          ? pin.counts.loveReacts.valueOf() + 1
          : pin.counts.loveReacts,
      goodIdeaReacts:
        data.reactType == 'Good idea'
          ? pin.counts.goodIdeaReacts.valueOf() + 1
          : pin.counts.goodIdeaReacts,
      hahaReacts:
        data.reactType == 'Haha'
          ? pin.counts.hahaReacts.valueOf() + 1
          : pin.counts.hahaReacts,
      thanksReacts:
        data.reactType == 'Thanks'
          ? pin.counts.thanksReacts.valueOf() + 1
          : pin.counts.thanksReacts,
    });
  }

  @SubscribeMessage('likeComment')
  async likeComment(socket: Socket, data: any) {
    const token = data.token;
    const decoded = await jwt.verify(token, process.env.jwtsecret);
    let userId = decoded._id;
    let user = await this.userModel.findById(userId, {
      firstName: 1,
      lastName: 1,
      profileImage: 1,
    });
    let pin = await this.pinModel.findById(data.pinId, { comments: 1 });
    for (var i = 0; i < pin.comments.length; i++) {
      if (String(pin.comments[i]._id) == String(data.commentId)) {
        socket.emit('sendLikeComment', {
          userName: user.firstName + ' ' + user.lastName,
          userImage: user.profileImage,
          pinId: data.pinId,
          commentId: pin.comments[i]._id,
          commentLikes: pin.comments[i].likes.counts.valueOf() + 1,
        });
        break;
      }
    }
  }

  @SubscribeMessage('likeReply')
  async likeReply(socket: Socket, data: any) {
    const token = data.token;
    const decoded = await jwt.verify(token, process.env.jwtsecret);
    let userId = decoded._id;
    let user = await this.userModel.findById(userId, {
      firstName: 1,
      lastName: 1,
      profileImage: 1,
    });
    let pin = await this.pinModel.findById(data.pinId, { comments: 1 });
    for (var i = 0; i < pin.comments.length; i++) {
      if (String(pin.comments[i]._id) == String(data.commentId)) {
        for (var j = 0; j < pin.comments[i].replies.length; j++) {
          if (String(pin.comments[i].replies[j]._id) == String(data.replyId)) {
            socket.emit('sendLikeReply', {
              userName: user.firstName + ' ' + user.lastName,
              userImage: user.profileImage,
              pinId: data.pinId,
              commentId: pin.comments[i]._id,
              replyId: data.replyId,
              replyLikes: pin.comments[i].replies[j].likes.counts.valueOf() + 1,
            });
            break;
          }
        }

        break;
      }
    }
  }
  @SubscribeMessage('clearUserId')
  async clearUserId(socket: Socket, data: any) {
    const token = data.token;
    const decoded = await jwt.verify(token, process.env.jwtsecret);
    let userId = decoded._id;
    let user = await this.userModel.findById(userId, { socketId: 1 });
    if (user) {
      user.socketId = 'none';
      await user.save();
    }
  }
}
