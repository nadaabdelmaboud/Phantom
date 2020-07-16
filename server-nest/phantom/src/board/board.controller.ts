import {
  Controller,
  Post,
  Body,
  UseFilters,
  ForbiddenException,
  NotAcceptableException,
  Param,
  Get,
  Request,
  UseGuards,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from '../shared/http-exception.filter';
import { BoardService } from './board.service';

@UseFilters(new HttpExceptionFilter())
@Controller()
export class BoardController {
  constructor(private BoardService: BoardService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/me/boards')
  async createBoard(@Request() req, @Body('name') name: string) {
    let userId = req.user._id;
    let createdBoard = await this.BoardService.createBoard(name, userId);
    if (createdBoard) {
      return createdBoard;
    } else {
      throw new NotAcceptableException({ message: 'board not created' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me/boards')
  async getCurrentUserBoards(@Request() req) {
    let userId = req.user._id;
    let boards = await this.BoardService.getCurrentUserBoards(userId);
    if (boards && boards.length != 0) {
      return boards;
    } else {
      throw new NotFoundException({ message: 'no boards' });
    }
  }
}
