import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Request,
  NotFoundException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(private ChatService: ChatService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getMessagesSent/:recieverIds/:senderId')
  async getMessagesSent(
    @Param('recieverIds') recieverIds: string,
    @Param('senderId') senderId: string) {
    let ids = recieverIds.split(',');
    let messages = await this.ChatService.getMessage(ids, senderId);
    if (messages) return messages;
    throw new NotFoundException();
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/getChats/:userId')
  async getChats(@Param('userId') userId,
  ) {
    let messages = await this.ChatService.getChats(userId);
    if (messages) return messages;
    throw new NotFoundException();
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('/seenDeliver/:messageId/:isSeen/:isDeliver/:userId')
  async seenDeliver(
    @Param('userId') userId,
    @Param('messageId') messageId: string,
    @Param('isSeen') isSeen: boolean,
    @Param('isDeliver') isDeliver: boolean
  ) {
    let messages = await this.ChatService.seenDeliverMessage(userId, messageId, isSeen, isDeliver);
    if (messages) return messages;
    throw new NotFoundException();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/sentMessage')
  async sentMessage(
    @Body('senderId') senderId: string,
    @Body('recieverId') recieverId: [string],
    @Body('message') message: string,
    @Body('name') name: string
  ) {
    let messages = await this.ChatService.sendMessage(senderId, recieverId, message, name);
    if (messages) return messages;
    throw new NotFoundException();
  }
}
