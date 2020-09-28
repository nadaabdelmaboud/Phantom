import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { pin } from '../types/pin';
import { user } from '../types/user';
import { ChatService } from 'src/chat/chat.service';
const jwt = require('jsonwebtoken');
@WebSocketGateway()
export class SharedGateway {
  @WebSocketServer() server;
  constructor(
    private ChatService: ChatService,
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    @InjectModel('User') private readonly userModel: Model<user>,
  ) { }
  async handleConnection(client: Socket) {
    console.log('client connected', client.id);
  }

  @SubscribeMessage('setUserId')
  async setUserId(socket: Socket, data: any) {
    const token = data.token;
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    let userId = decoded._id;
    let user = await this.userModel.findById(userId, { socketId: 1 });
    if (user) {
      console.log('user', socket.id);
      user.socketId = socket.id;
      await user.save();
    }
  }
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  @SubscribeMessage('comment')
  async comment(socket: Socket, data: any) {
    // socket.broadcast.emit('sendComment', data);
    //  this.server.sockets.emit('sendComment', data);
    this.server.emit('sendComment', data);
  }
  @SubscribeMessage('typing')
  async type(socket: Socket, data: any) {
    let senderId = data.senderId;
    let sender = await this.userModel.findById(senderId);
    let recieverId = data.recieverId;
    let reciever = await this.userModel.findById(recieverId);
    if (sender && reciever) {
      console.log('sending');
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
    console.log('deliver event');
    if (sender && reciever) {
      console.log(reciever.socketId, 'to emiit');
      socket.to(sender.socketId).emit('setDelivered', {
        recieverImage: reciever.profileImage,
        senderImage: sender.profileImage,
        recieverName: reciever.firstName + ' ' + reciever.lastName,
        senderName: sender.firstName + ' ' + sender.lastName,
        senderId: data.senderId,
        messageId: data.messageId,
      });
      await this.ChatService.deliver(recieverId, messageId);
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
      socket.to(sender.socketId).emit('setSeen', {
        recieverImage: reciever.profileImage,
        senderImage: sender.profileImage,
        recieverName: reciever.firstName + ' ' + reciever.lastName,
        senderName: sender.firstName + ' ' + sender.lastName,
        senderId: data.senderId,
        messageId: data.messageId,
      });
      if (data.messageId)
        await this.ChatService.seen(recieverId, messageId);
    }
  }
  @SubscribeMessage('message')
  async message(socket: Socket, data: any) {
    let messageText = data.message;
    let senderId = data.senderId;
    let sender = await this.userModel.findById(senderId);
    let recieverId = data.recieverId;
    let reciever = await this.userModel.findById(recieverId);
    let messageId = await this.ChatService.sendMessage(
      senderId,
      [recieverId],
      messageText,
    );
    if (sender && reciever && messageText) {
      socket.to(reciever.socketId).emit('sendMessage', {
        recieverImage: reciever.profileImage,
        senderImage: sender.profileImage,
        recieverName: reciever.firstName + ' ' + reciever.lastName,
        senderName: sender.firstName + ' ' + sender.lastName,
        message: messageText,
        senderId: data.senderId,
        date: Date.now(),
        messageId: messageId,
      });
    }
  }

  @SubscribeMessage('reply')
  async reply(socket: Socket, data: any) {
    this.server.emit('sendReply', data);
  }

  @SubscribeMessage('reactPin')
  async reactPin(socket: Socket, data: any) {
    const token = data.token;
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    let userId = decoded._id;
    let user = await this.userModel.findById(userId, {
      firstName: 1,
      lastName: 1,
      profileImage: 1,
    });
    let pin = await this.pinModel.findById(data.pinId, { counts: 1 });
    this.server.emit('sendPinReact', {
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
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    let userId = decoded._id;
    let user = await this.userModel.findById(userId, {
      firstName: 1,
      lastName: 1,
      profileImage: 1,
    });
    let pin = await this.pinModel.findById(data.pinId, { comments: 1 });
    for (var i = 0; i < pin.comments.length; i++) {
      if (String(pin.comments[i]._id) == String(data.commentId)) {
        this.server.emit('sendLikeComment', {
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
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
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
            this.server.emit('sendLikeReply', {
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
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    let userId = decoded._id;
    let user = await this.userModel.findById(userId, { socketId: 1 });
    if (user) {
      user.socketId = 'none';
      await user.save();
    }
  }
}
