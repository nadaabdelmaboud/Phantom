import {
  Controller,
  Get,
  NotFoundException,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SearchService } from './search.service';
@Controller('search')
export class SearchController {
  constructor(private SearchService: SearchService) { }
  @UseGuards(AuthGuard('jwt'))
  @Get('/allPins')
  async getAllPins(
    @Request() req,
    @Query('name') name: string,
    @Query('recentSearch') recentSearch: Boolean,
    @Query('limit') limit: Number,
    @Query('offset') offset: Number,
  ) {
    let userId = req.user._id;
    if (recentSearch)
      await this.SearchService.addToRecentSearch(userId, name);
    let pins = await this.SearchService.getAllPins(name, limit, offset);
    if (pins) return pins;
    return new NotFoundException();

  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/myPins')
  async getMyPins(
    @Request() req,
    @Query('name') name: string,
    @Query('recentSearch') recentSearch: Boolean,
    @Query('limit') limit: Number,
    @Query('offset') offset: Number,
  ) {
    let userId = req.user._id;
    if (recentSearch)
      await this.SearchService.addToRecentSearch(userId, name);
    let pins = await this.SearchService.getMyPins(name, userId, limit, offset);
    if (pins)
      return pins;
    return new NotFoundException();

  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/people')
  async getPeople(
    @Request() req,
    @Query('name') name: string,
    @Query('recentSearch') recentSearch: Boolean,
    @Query('limit') limit: Number,
    @Query('offset') offset: Number,
  ) {
    let userId = req.user._id;
    if (recentSearch)
      await this.SearchService.addToRecentSearch(userId, name);
    let users = await this.SearchService.getPeople(name, limit, offset);
    if (users) return users;
    return new NotFoundException();

  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/board')
  async getBoards(
    @Request() req,
    @Query('recentSearch') recentSearch: Boolean,
    @Query('name') name: string,
    @Query('limit') limit: Number,
    @Query('offset') offset: Number,
  ) {
    let userId = req.user._id;
    if (recentSearch)
      await this.SearchService.addToRecentSearch(userId, name);
    let boards = await this.SearchService.getBoards(name, limit, offset);
    if (boards) return boards;
    return new NotFoundException();

  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/recentSearch')
  async getRecentSearch(
    @Request() req,
  ) {
    let userId = req.user._id;
    let recentSearch = await this.SearchService.getRecentSearch(userId);
    if (recentSearch) return recentSearch;
    return new NotFoundException();

  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/getKeys')
  async getKeys(
    @Request() req,
    @Query('name') name
  ) {
    let recentSearch = await this.SearchService.getKeys(name);
    if (recentSearch) return recentSearch;
    return new NotFoundException();

  }
}
