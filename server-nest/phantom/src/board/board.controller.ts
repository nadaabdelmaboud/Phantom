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
import { HttpExceptionFilter } from '../shared/http-exception.filter';
import { BoardService } from './board.service';

@UseFilters(new HttpExceptionFilter())
@Controller('board')
export class BoardController {
  constructor(private BoardService: BoardService) {}
  @Post('/me/boards')
  async createBoard(@Body('name') name: string) {
    let userId = '5ef10225f775502d20121345';
    let createdBoard = await this.BoardService.createBoard(name, userId);
    if (createdBoard) {
      return createdBoard;
    } else {
      throw new NotAcceptableException({ message: 'board not created' });
    }
  }
  @Get('/me/boards')
  async getCurrentUserBoards() {
    let userId = '5ef10225f775502d20121345';
    let boards = await this.BoardService.getCurrentUserBoards(userId);
    if (boards && boards.length != 0) {
      return boards;
    } else {
      throw new NotFoundException({ message: 'no boards' });
    }
  }
}
