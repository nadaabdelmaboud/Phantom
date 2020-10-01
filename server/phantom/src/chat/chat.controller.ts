import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  NotFoundException,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';
import { HttpExceptionFilter } from 'src/shared/http-exception.filter';

@UseFilters(HttpExceptionFilter)
@Controller()
export class ChatController {
  constructor(private ChatService: ChatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/getMessagesSent/:recieverIds/:senderId')
  async getMessagesSent(
    @Param('recieverIds') recieverIds: string,
    @Param('senderId') senderId: string,
  ) {
    let ids = recieverIds.split(',');
    let messages = await this.ChatService.getMessage(ids, senderId);
    if (messages) return messages;
    throw new NotFoundException('there is no messages');
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/getChats/:userId')
  async getChats(@Param('userId') userId) {
    let messages = await this.ChatService.getChats(userId);
    if (messages) return messages;
    throw new NotFoundException();
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('/seen')
  async seenDeliver(
    @Body('senderId') senderId: string,
    @Body('recieverId') recieverId: string,
    @Body('time') time: string,
  ) {
    let messages = await this.ChatService.seenMessage(
      senderId,
      recieverId,
      time,
    );
    if (messages) return messages;
    throw new NotFoundException();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/sentMessage')
  async sentMessage(
    @Body('senderId') senderId: string,
    @Body('recieverId') recieverId: [string],
    @Body('message') message: string,
    @Body('name') name: string,
  ) {
    let messages = await this.ChatService.sendMessage(
      senderId,
      recieverId,
      message,
    );
    if (messages) return messages;
    throw new NotFoundException();
  }
}
