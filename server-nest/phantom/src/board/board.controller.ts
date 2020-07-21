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
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from '../shared/http-exception.filter';
import { BoardService } from './board.service';
import { editBoardDto } from './dto/editBoard.dto';
@Controller()
export class BoardController {
  constructor(private BoardService: BoardService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/me/boards')
  async createBoard(
    @Request() req,
    @Body('name') name: string,
    @Body('startDate') startDate: string,
    @Body('endDate') endDate: string,
    @Body('status') status: string,
  ) {
    let userId = req.user._id;
    let createdBoard = await this.BoardService.createBoard(
      name,
      new Date(startDate),
      new Date(endDate),
      status,
      userId,
    );
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
  @UseGuards(AuthGuard('jwt'))
  @Get('/users/:id/boards')
  async getSomeUserBoards(@Request() req, @Param('id') id: string) {
    let userId = req.user._id;
    let boards = await this.BoardService.getSomeUserBoards(userId, id);
    if (boards && boards.length != 0) {
      return boards;
    } else {
      throw new NotFoundException({ message: 'no boards' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/me/boards/sortAZ')
  async sortBoardsAtoZ(@Request() req) {
    let userId = req.user._id;
    let boards = await this.BoardService.sortBoardsAtoZ(userId);
    if (boards && boards.length != 0) {
      return boards;
    } else {
      throw new NotFoundException({ message: 'no boards' });
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('/me/boards/sortDate')
  async sortBoardsDate(@Request() req) {
    let userId = req.user._id;
    let boards = await this.BoardService.sortBoardsDate(userId);
    if (boards && boards.length != 0) {
      return boards;
    } else {
      throw new NotFoundException({ message: 'no boards' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/me/boards/reorderBoards')
  async reorderBoards(
    @Request() req,
    @Query('startIndex') startIndex: number,
    @Query('positionIndex') positionIndex: number,
  ) {
    let userId = req.user._id;
    let boards = await this.BoardService.reorderBoards(
      userId,
      startIndex,
      positionIndex,
    );
    if (boards && boards.length != 0) {
      return boards;
    } else {
      throw new NotFoundException({ message: 'no boards' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/me/boards/edit/:boardId')
  async editBoard(
    @Request() req,
    @Param('boardId') boardId: string,
    @Body() editBoardDto: editBoardDto,
  ) {
    let userId = req.user._id;
    let board = await this.BoardService.editBoard(
      boardId,
      userId,
      editBoardDto,
    );
    if (board) {
      return board;
    } else {
      throw new NotAcceptableException("board couldn't be updated");
    }
  }
}
