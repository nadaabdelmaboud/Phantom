import {
    Controller,
    Post,
    Body,
    Param,
    Get,
    NotFoundException,
    UseGuards,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { HttpExceptionFilter } from '../shared/http-exception.filter';
  import { ChatService } from './chat.service';
import { Board } from 'src/models/board.schema';

  @Controller()
  export class ChatController {
    constructor(private ChatService: ChatService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('/getMessagesSent/:senderId/:recieverId')
    async getMessagesSent(
                          @Param('senderId') senderId: string,
                          @Param('recieverId') recieverId: string
                          ){
        let messages = await this.ChatService.getMessagesSent(senderId, recieverId);
        if (messages) return messages; 
        throw new NotFoundException();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/sentMessage')
    async sentMessage(
                      @Body('senderId') senderId: string, 
                      @Body('recieverId') recieverId: string,
                      @Body('message') message: string
                     ){
        let messages = await this.ChatService.sentMessage(senderId, recieverId, message);
        if (messages) return messages; 
        throw new NotFoundException();
    }
  }
