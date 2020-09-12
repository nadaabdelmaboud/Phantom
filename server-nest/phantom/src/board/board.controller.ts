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
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from '../shared/http-exception.filter';
import { BoardService } from './board.service';
import { EditBoardDto } from './dto/edit-board.dto';
import { EditCollaboratoresPermissionsDto } from './dto/edit-collaboratores-permissions.dto';

@UseFilters(HttpExceptionFilter)
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
    console.log(userId);
    let createdBoard = await this.BoardService.createBoard(
      name,
      startDate,
      endDate,
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
    let boards = await this.BoardService.getCurrentUserBoards(userId, true);
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
  @Get('/boards/state/:id')
  async isBoardPublic(@Param('id') id: string) {
    let state = await this.BoardService.isPublicBoard(id);
    return state;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/me/boards/sortAZ')
  async sortBoardsAtoZ(@Request() req) {
    let userId = req.user._id;
    let boards = await this.BoardService.sortBoardsAtoZ(userId);
    if (boards) {
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
    if (boards) {
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
    if (boards) {
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
    @Body() editBoardDto: EditBoardDto,
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
  @UseGuards(AuthGuard('jwt'))
  @Get('/me/boards/:boardId/collaboratores')
  async getCollaboratoresPermissions(
    @Request() req,
    @Param('boardId') boardId: string,
  ) {
    let userId = req.user._id;
    let collaboratores = await this.BoardService.getCollaboratoresPermissions(
      userId,
      boardId,
    );
    if (collaboratores) {
      return collaboratores;
    } else {
      throw new NotAcceptableException('collaboratores not found');
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('/me/boards/:boardId/collaboratores')
  async editCollaboratoresPermissions(
    @Request() req,
    @Param('boardId') boardId: string,
    @Body() editCollaboratoresPermissionsDto: EditCollaboratoresPermissionsDto,
  ) {
    let userId = req.user._id;
    let collaborator = await this.BoardService.editCollaboratoresPermissions(
      userId,
      boardId,
      editCollaboratoresPermissionsDto,
    );
    if (collaborator) {
      return collaborator;
    } else {
      throw new NotAcceptableException('collaborator couldnt be edited');
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('/me/boards/:boardId/collaboratores')
  async deleteCollaborator(
    @Request() req,
    @Param('boardId') boardId: string,
    @Body('collaboratorId') collaboratorId: string,
  ) {
    let userId = req.user._id;
    let isdeleted = await this.BoardService.deleteCollaborator(
      userId,
      boardId,
      collaboratorId,
    );
    if (isdeleted) {
      return { success: 'collaborator has been deleted' };
    } else {
      throw new NotAcceptableException('collaborator couldnt be deleted');
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('/me/boards/:boardId')
  async deleteBoard(@Request() req, @Param('boardId') boardId: string) {
    let userId = req.user._id;
    let deletedBoard = await this.BoardService.deleteBoard(userId, boardId);
    if (deletedBoard) {
      return { success: 'Board is deleted succissfully' };
    } else {
      throw new NotAcceptableException({ message: 'Board is not deleated' });
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('/me/boards/:boardId/section')
  async createSection(
    @Request() req,
    @Param('boardId') boardId: string,
    @Body('sectionName') sectionName: string,
  ) {
    let userId = req.user._id;
    let createSection = await this.BoardService.createSection(
      boardId,
      sectionName,
      userId,
    );
    if (createSection) {
      return createSection;
    } else {
      throw new NotAcceptableException({ message: 'Section is not created' });
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('/me/boards/:boardId/section/:sectionId')
  async deleteSection(
    @Request() req,
    @Param('boardId') boardId: string,
    @Param('sectionId') sectionId: string,
  ) {
    let userId = req.user._id;
    let deleteSection = await this.BoardService.deleteSection(
      boardId,
      sectionId,
      userId,
    );
    if (deleteSection) {
      return { success: 'section deleted succissfully' };
    } else {
      throw new NotAcceptableException({ message: 'Section is not deleated' });
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('/me/boards/merge')
  async mergeBoards(
    @Request() req,
    @Body('originalBoardId') originalBoardId: string,
    @Body('mergedBoardId') mergedBoardId: string,
  ) {
    let userId = req.user._id;
    let board = await this.BoardService.merge(
      originalBoardId,
      mergedBoardId,
      userId,
    );
    if (board) {
      return board;
    } else {
      throw new NotAcceptableException({ message: 'Boards are not merged' });
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/boards/:boardId')
  async getFullBoard(@Request() req, @Param('boardId') boardId: string) {
    let userId = req.user._id;
    let board = await this.BoardService.getBoardFull(boardId, userId);
    if (board) {
      return board;
    } else {
      throw new NotAcceptableException({ message: 'Board is not found' });
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/boards/:boardId/sections/:sectionId')
  async getFullSection(
    @Request() req,
    @Param('boardId') boardId: string,
    @Param('sectionId') sectionId: string,
  ) {
    let userId = req.user._id;
    let section = await this.BoardService.getSectionFull(
      boardId,
      sectionId,
      userId,
    );
    if (section) {
      return section;
    } else {
      throw new NotAcceptableException({ message: 'section is not found' });
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('/me/savedPins/:pinId')
  async unsavePinFromBoard(
    @Request() req,
    @Param('pinId') pinId: string,
    @Query('boardId') boardId: string,
    @Query('sectionId') sectionId: string,
  ) {
    let userId = req.user._id;
    let unsavedPin = await this.BoardService.unsavePin(
      pinId,
      boardId,
      sectionId,
      userId,
      false,
    );
    if (unsavedPin) {
      return { success: 'pin is unsaved suucissfully' };
    } else {
      throw new NotAcceptableException({ message: 'pin hasnt been unsaved' });
    }
  }
}
