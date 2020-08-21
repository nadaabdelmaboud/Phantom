import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from './user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { pin } from 'src/types/pin';
import { user } from 'src/types/user';
const jwt = require('jsonwebtoken');
@WebSocketGateway()
export class SharedGateway {
  constructor(
    private UserService: UserService,
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    @InjectModel('User') private readonly userModel: Model<user>,
  ) {}
  @SubscribeMessage('setUserId')
  async setUserId(socket: Socket, data: any) {
    const token = data.token;
    const decoded = await jwt.verify(token, process.env.jwtsecret);
    let userId = decoded._id;
    let user = await this.UserService.getUserById(userId);
    if (user) {
      user.socketId = socket.id;
      await user.save();
    }
  }
  @SubscribeMessage('comment')
  async comment(socket: Socket, data: any) {
    let commentText = data.commentText;
    let pinId = data.pinId;
    let pin = await this.pinModel.findById(pinId);
    const token = data.token;
    const decoded = await jwt.verify(token, process.env.jwtsecret);
    let commenterId = decoded._id;
    let commenter = await this.userModel.findById(commenterId);
    if (commenter && pin && commentText) {
      socket.emit('sendComment', {
        commentText: data.text,
        commenterName: commenter.firstName + ' ' + commenter.lastName,
        commenterImage: commenter.profileImage,
        pinId: data.pinId,
        date: Date.now(),
      });
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
    let pinId = data.pinId;
    let commentId = data.commentId;
    let pin = await this.pinModel.findById(pinId);
    const token = data.token;
    const decoded = await jwt.verify(token, process.env.jwtsecret);
    let replierId = decoded._id;
    let replier = await this.userModel.findById(replierId);
    if (replier && pin && replyText) {
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
    let user = await this.userModel.findById(userId);
    let pin = await this.pinModel.findById(data.pinId);
    socket.emit('sendPinReact', {
      reactType: data.reactType,
      userName: user.firstName + ' ' + user.lastName,
      userImage: user.profileImage,
      pinId: data.pinId,
      wowReacts: pin.counts.wowReacts,
      loveReacts: pin.counts.loveReacts,
      goodIdeaReacts: pin.counts.goodIdeaReacts,
      hahaReacts: pin.counts.hahaReacts,
      thanksReacts: pin.counts.thanksReacts,
    });
  }

  @SubscribeMessage('likeComment')
  async likeComment(socket: Socket, data: any) {
    const token = data.token;
    const decoded = await jwt.verify(token, process.env.jwtsecret);
    let userId = decoded._id;
    let user = await this.userModel.findById(userId);
    let pin = await this.pinModel.findById(data.pinId);
    for (var i = 0; i < pin.comments.length; i++) {
      if (String(pin.comments[i]._id) == String(data.commentId)) {
        socket.emit('sendLikeComment', {
          userName: user.firstName + ' ' + user.lastName,
          userImage: user.profileImage,
          pinId: data.pinId,
          commentId: pin.comments[i]._id,
          commentLikes: pin.comments[i].likes.counts,
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
    let user = await this.userModel.findById(userId);
    let pin = await this.pinModel.findById(data.pinId);
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
              replyLikes: pin.comments[i].replies[j].likes.counts,
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
    let user = await this.userModel.findById(userId);
    if (user) {
      user.socketId = 'none';
      await user.save();
    }
  }
}
