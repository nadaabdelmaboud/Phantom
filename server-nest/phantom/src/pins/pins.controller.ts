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
  Request,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePinDto } from './dto/create-pin.dto';
import { HttpExceptionFilter } from '../shared/http-exception.filter';
import { PinsService } from './pins.service';
import { ImagesService } from '../images/images.service';
import { BoardService } from '../board/board.service';

@Controller()
export class PinsController {
  constructor(
    private PinsService: PinsService,
    private ImagesService: ImagesService,
    private BoardService: BoardService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/me/pins')
  async createPin(@Request() req, @Body() createPinDto: CreatePinDto) {
    let userId = req.user._id;
    let createdPin = await this.PinsService.createPin(userId, createPinDto);
    if (createdPin) {
      return createdPin;
    } else {
      await this.ImagesService.deleteFile(createPinDto.imageId.toString());
      throw new NotAcceptableException({ message: 'pin is not created' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me/pins')
  async getCurrentUserPins(@Request() req) {
    let userId = req.user._id;
    let pins = await this.PinsService.getCurrentUserPins(userId);
    if (pins && pins.length != 0) {
      return pins;
    } else {
      throw new NotFoundException({ message: 'no pins' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/me/savedPins/:id')
  async savePin(
    @Request() req,
    @Param('id') pinId: string,
    @Query('boardId') boardId: string,
  ) {
    let userId = req.user._id;
    let savedPin = await this.PinsService.savePin(userId, pinId, boardId);
    if (savedPin) {
      return { success: true };
    } else {
      throw new NotAcceptableException({ message: 'pin is not saved' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me/savedPins')
  async getCurrentUserSavedPins(@Request() req) {
    let userId = req.user._id;
    let pins = await this.PinsService.getCurrentUserSavedPins(userId);
    if (pins && pins.length != 0) {
      return pins;
    } else {
      throw new NotFoundException({ message: 'no pins' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/pins/:pinId/comments')
  async createComment(
    @Request() req,
    @Body('commentText') commentText: string,
    @Param('pinId') pinId: string,
  ) {
    let userId = req.user._id;
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

  @UseGuards(AuthGuard('jwt'))
  @Post('/pins/:pinId/comments/:commentId/replies')
  async createReply(
    @Request() req,
    @Body('replyText') replyText: string,
    @Param('pinId') pinId: string,
    @Param('commentId') commentId: string,
  ) {
    let userId = req.user._id;
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

  @UseGuards(AuthGuard('jwt'))
  @Get('/pins/:pinId/comments')
  async getPinCommentsReplies(@Request() req, @Param('pinId') pinId: string) {
    let userId = req.user._id;
    let comments = await this.PinsService.getPinCommentsReplies(pinId);
    if (comments) {
      return { success: true, comments: comments };
    } else {
      throw new NotFoundException({ message: 'comments not found' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/pins/:pinId/reacts')
  async createReact(
    @Request() req,
    @Param('pinId') pinId: string,
    @Query('reactType') reactType: string,
  ) {
    let userId = req.user._id;
    let react = await this.PinsService.createReact(pinId, reactType, userId);
    if (react) {
      return { success: true };
    } else {
      throw new NotAcceptableException({ message: 'react is not created' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/pins/:pinId/comments/:commentId/likes')
  async likeComment(
    @Request() req,
    @Param('pinId') pinId: string,
    @Param('commentId') commentId: string,
  ) {
    let userId = req.user._id;
    let like = await this.PinsService.likeComment(pinId, commentId, userId);
    if (like) {
      return { success: true };
    } else {
      throw new NotAcceptableException({ message: 'like is not created' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/pins/:pinId/comments/:commentId/replies/:replyId/likes')
  async likeReply(
    @Request() req,
    @Param('pinId') pinId: string,
    @Param('commentId') commentId: string,
    @Param('replyId') replyId: string,
  ) {
    let userId = req.user._id;
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
  @UseGuards(AuthGuard('jwt'))
  @Delete('/me/pins/:pinId')
  async deletePin(@Request() req, @Param('pinId') pinId: string) {
    let userId = req.user._id;
    let deletedPin = await this.BoardService.deletePin(pinId, userId, false);
    if (deletedPin) {
      return { success: 'pin is deleted succissfully' };
    } else {
      throw new NotAcceptableException({ message: 'pin is not deleated' });
    }
  }
}
