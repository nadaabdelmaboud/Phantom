import {
    Controller,
    Post,
    Body,
    Put,
    Delete,
    UseFilters,
    ForbiddenException,
    NotAcceptableException,
    BadRequestException,
    Param,
    Get,
    NotFoundException,
    UseGuards,
    Request,
    Query,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { HttpExceptionFilter } from '../shared/http-exception.filter';
  import { ChatService } from './chat.service';
import { Board } from 'src/models/board.schema';

  @Controller()
  export class ChatController {
    constructor(private ChatService: ChatService) {}
    @Get('/getMessagesSent/:senderId/:recieverId')
    async getMessagesSent(@Param('senderId') senderId: string,
    @Param('recieverId') recieverId: string) {
        let messages = await this.ChatService.getMessagesSent(senderId, recieverId);
        if (messages) return messages; 
        return new NotFoundException();
    }
    @Post('/sentMessage')
    async sentMessage(
                      @Body('senderId') senderId: string, 
                      @Body('recieverId') recieverId: string,
                      @Body('message') message: string
                     ){
        let messages = await this.ChatService.sentMessage(senderId, recieverId, message);
        if (messages) return messages; 
        return new NotFoundException();
    }
  }
