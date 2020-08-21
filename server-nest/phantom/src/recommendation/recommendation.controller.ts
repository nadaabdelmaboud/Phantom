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
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from '../shared/http-exception.filter';
import { RecommendationService } from './recommendation.service';
@UseFilters(HttpExceptionFilter)
@Controller()
export class RecommendationController {
  constructor(private RecommendationService: RecommendationService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('/me/home')
  async getHomeFeed(@Request() req) {
    let userId = req.user._id;
    let home = await this.RecommendationService.homeFeed(userId);
    if (home) {
      return home;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/more/pins/:pinId')
  async pinMoreLike(@Request() req, @Param('pinId') pinId: string) {
    let userId = req.user._id;
    let pins = await this.RecommendationService.pinMoreLike(userId, pinId);
    if (pins) {
      return pins;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/more/boards/:boardId')
  async boardMoreLike(@Request() req, @Param('boardId') boardId: string) {
    let userId = req.user._id;
    let pins = await this.RecommendationService.boardMoreLike(userId, boardId);
    if (pins) {
      return pins;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/more/sections/:boardId/:sectionId')
  async sectionMoreLike(
    @Request() req,
    @Param('boardId') boardId: string,
    @Param('sectionId') sectionId: string,
  ) {
    let userId = req.user._id;
    let pins = await this.RecommendationService.sectionMoreLike(
      userId,
      boardId,
      sectionId,
    );
    if (pins) {
      return pins;
    } else {
      throw new NotFoundException();
    }
  }
}
