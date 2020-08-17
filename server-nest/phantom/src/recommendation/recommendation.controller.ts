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
}
