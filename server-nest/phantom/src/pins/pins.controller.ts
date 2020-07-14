import {
  Controller,
  Post,
  Body,
  UseFilters,
  ForbiddenException,
  NotAcceptableException,
  Param,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { createPinDto } from './dto/create-pin.dto';
import { HttpExceptionFilter } from '../shared/http-exception.filter';
import { PinsService } from './pins.service';
import { ImagesService } from '../images/images.service';
@UseFilters(new HttpExceptionFilter())
@Controller()
export class PinsController {
  constructor(
    private PinsService: PinsService,
    private ImagesService: ImagesService,
  ) {}
  @Post('/me/pins')
  async createPin(@Body() createPinDto: createPinDto) {
    let userId = '5ef10225f775502d20121345';
    let createdPin = await this.PinsService.createPin(userId, createPinDto);
    if (createdPin) {
      return createdPin;
    } else {
      await this.ImagesService.deleteFile(createPinDto.imageId.toString());
      throw new NotAcceptableException({ message: 'pin is not created' });
    }
  }
  @Get('/me/pins')
  async getCurrentUserPins() {
    let userId = '5ef10225f775502d20121345';
    let pins = await this.PinsService.getCurrentUserPins(userId);
    if (pins && pins.length != 0) {
      return pins;
    } else {
      throw new NotFoundException({ message: 'no pins' });
    }
  }
  @Post('/me/savedPins/:id')
  async savePin(@Param('id') pinId: string, @Query('boardId') boardId: string) {
    let userId = '5ef10225f775502d20121345';
    let savedPin = await this.PinsService.savePin(userId, pinId, boardId);
    if (savedPin) {
      return { success: true };
    } else {
      throw new NotAcceptableException({ message: 'pin is not saved' });
    }
  }
  @Get('/me/savedPins')
  async getCurrentUserSavedPins() {
    let userId = '5ef10225f775502d20121345';
    let pins = await this.PinsService.getCurrentUserSavedPins(userId);
    if (pins && pins.length != 0) {
      return pins;
    } else {
      throw new NotFoundException({ message: 'no pins' });
    }
  }
  @Post('/pins/:pinId/comments')
  async createComment(
    @Body('commentText') commentText: string,
    @Param('pinId') pinId: string,
  ) {
    let userId = '5ef10225f775502d20121345';
    let comment = await this.PinsService.createComment(
      pinId,
      commentText,
      userId,
    );
    if (comment) {
      return { success: true };
    } else {
      throw new NotAcceptableException({ message: 'comment is not created' });
    }
  }
  @Post('/pins/:pinId/comments/:commentId/replies')
  async createReply(
    @Body('replyText') replyText: string,
    @Param('pinId') pinId: string,
    @Param('commentId') commentId: string,
  ) {
    let userId = '5ef10225f775502d20121345';
    let reply = await this.PinsService.createReply(
      pinId,
      replyText,
      userId,
      commentId,
    );
    if (reply) {
      return { success: true };
    } else {
      throw new NotAcceptableException({ message: 'reply is not created' });
    }
  }
  @Get('/pins/:pinId/comments')
  async getPinCommentsReplies(@Param('pinId') pinId: string) {
    let userId = '5ef10225f775502d20121345';
    let comments = await this.PinsService.getPinCommentsReplies(pinId);
    if (comments) {
      return { success: true, comments: comments };
    } else {
      throw new NotFoundException({ message: 'comments not found' });
    }
  }

  @Post('/pins/:pinId/reacts')
  async createReact(
    @Param('pinId') pinId: string,
    @Query('reactType') reactType: string,
  ) {
    let userId = '5ef10225f775502d20121345';
    let react = await this.PinsService.createReact(pinId, reactType, userId);
    if (react) {
      return { success: true };
    } else {
      throw new NotAcceptableException({ message: 'react is not created' });
    }
  }
  @Post('/pins/:pinId/comments/:commentId/likes')
  async likeComment(
    @Param('pinId') pinId: string,
    @Param('commentId') commentId: string,
  ) {
    let userId = '5ef10225f775502d20121345';
    let like = await this.PinsService.likeComment(pinId, commentId, userId);
    if (like) {
      return { success: true };
    } else {
      throw new NotAcceptableException({ message: 'like is not created' });
    }
  }
  @Post('/pins/:pinId/comments/:commentId/replies/:replyId/likes')
  async likeReply(
    @Param('pinId') pinId: string,
    @Param('commentId') commentId: string,
    @Param('replyId') replyId: string,
  ) {
    let userId = '5ef10225f775502d20121345';
    let like = await this.PinsService.likeReply(
      pinId,
      commentId,
      userId,
      replyId,
    );
    if (like) {
      return { success: true };
    } else {
      throw new NotAcceptableException({ message: 'like is not created' });
    }
  }
}
