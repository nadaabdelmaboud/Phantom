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
  @Put('/home/me')
  async generateHomeFeed(@Request() req) {
    req.setTimeout(0);
    let userId = req.user._id;
    let home = await this.RecommendationService.homeFeed(userId);
    if (home) {
      return home;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/me/home')
  async getHomeFeed(
    @Request() req,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    let userId = req.user._id;
    let home = await this.RecommendationService.getHomeFeed(
      userId,
      limit,
      offset,
    );
    if (home) {
      return home;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('/more/pins/:pinId')
  async generatePinMore(@Request() req, @Param('pinId') pinId: string) {
    let userId = req.user._id;
    req.setTimeout(0);
    let pins = await this.RecommendationService.pinMoreLike(userId, pinId);
    if (pins) {
      return pins;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/more/pins/:pinId')
  async getPinMore(
    @Request() req,
    @Param('pinId') pinId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    let pins = await this.RecommendationService.getPinMoreLike(
      pinId,
      limit,
      offset,
    );
    if (pins) {
      return pins;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('/more/boards/:boardId')
  async generateBoardMoreLike(
    @Request() req,
    @Param('boardId') boardId: string,
  ) {
    let userId = req.user._id;
    req.setTimeout(0);
    let pins = await this.RecommendationService.boardMoreLike(userId, boardId);
    if (pins) {
      return pins;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('/more/sections/:boardId/:sectionId')
  async generateSectionMoreLike(
    @Request() req,
    @Param('boardId') boardId: string,
    @Param('sectionId') sectionId: string,
  ) {
    let userId = req.user._id;
    req.setTimeout(0);
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

  @UseGuards(AuthGuard('jwt'))
  @Get('/more/boards/:boardId')
  async getBoardMore(
    @Request() req,
    @Param('boardId') boardId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    let pins = await this.RecommendationService.getBoardMoreLike(
      boardId,
      offset,
      limit,
    );
    if (pins) {
      return pins;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/more/sections/:boardId/:sectionId')
  async getSectionMore(
    @Request() req,
    @Param('boardId') boardId: string,
    @Param('sectionId') sectionId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    let pins = await this.RecommendationService.getSectionMoreLike(
      boardId,
      sectionId,
      offset,
      limit,
    );
    if (pins) {
      return pins;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/me/recommendation/follow')
  async getFollowRecommendation(@Request() req) {
    let userId = req.user._id;
    req.setTimeout(0);
    let follow = await this.RecommendationService.followAllRecommendation(
      userId,
    );
    if (follow) {
      return follow;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/me/recommendation/topics/:topicName')
  async getTopicRecommendation(
    @Request() req,
    @Param('topicName') topicName: string,
  ) {
    let userId = req.user._id;
    req.setTimeout(0);
    let follow = await this.RecommendationService.topicRecommendation(
      topicName,
      userId,
    );
    if (follow) {
      return follow;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/me/recommendation/trending')
  async getTrendingRecommendation(@Request() req) {
    let userId = req.user._id;
    req.setTimeout(0);
    let follow = await this.RecommendationService.trendingRecommendation(
      userId,
    );
    if (follow) {
      return follow;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/me/boardsForYou')
  async getBoardsForYou(@Request() req) {
    let userId = req.user._id;
    req.setTimeout(0);
    let boards = await this.RecommendationService.boardsForYou(userId);
    if (boards) {
      return boards;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/me/popularPins')
  async getPopularPins(@Request() req, @Query('isSearch') isSearch: Boolean) {
    let userId = req.user._id;
    req.setTimeout(0);
    let pins = await this.RecommendationService.popularPins(userId, isSearch);
    if (pins) {
      return pins;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/me/pinsForYou')
  async getPinsForYou(@Request() req, @Query('isSearch') isSearch: Boolean) {
    let userId = req.user._id;
    req.setTimeout(0);
    let pins = await this.RecommendationService.pinsForYou(userId, isSearch);
    if (pins) {
      return pins;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/me/pinsRecentActivity')
  async getPinsRecentActivity(
    @Request() req,
    @Query('isSearch') isSearch: Boolean,
  ) {
    let userId = req.user._id;
    req.setTimeout(0);
    let pins = await this.RecommendationService.pinsInspired(userId, isSearch);
    if (pins) {
      return pins;
    } else {
      throw new NotFoundException();
    }
  }
}
