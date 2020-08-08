import {
    Controller,
    Body,
    UseFilters,
    ForbiddenException,
    NotAcceptableException,
    Param,
    Get,
    NotFoundException,
    UseGuards,
    Request,
    Query,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { HttpExceptionFilter } from '../shared/http-exception.filter';
  import { ImagesService } from '../images/images.service';
  import { SearchService } from './search.service';
  import { of, from } from 'rxjs';
@Controller('search')
export class SearchController {
    constructor(
        private SearchService: SearchService,
        private ImageService: ImagesService,
      ) {}
      //get all the pins
     
      @Get('/allPins/:name')
      async getAllPins(@Request() req, @Param('name') name: string,  @Param('limit') limit: Number, @Param('offset') offset: Number) {
        let pins = await this.SearchService.getAllPins(name, limit, offset)
        if (pins) {
          return pins;
        } else {
          return new NotFoundException();
        }
      }
      @UseGuards(AuthGuard('jwt'))
      @Get('/myPins/:name')
      async getMyPins(@Request() req,@Param('name') name: string,  @Param('limit') limit: Number, @Param('offset') offset: Number) {
        let userId = req.user._id;

        let pins = await this.SearchService.getMyPins(name, userId, limit, offset)
        if (pins) {
          return pins;
        } else {
          return new NotFoundException();
        }
      }
      @Get('/people')
      async getPeople(@Request() req, @Query('name') name: string,  @Query('limit') limit: Number, @Query('offset') offset: Number) {
        let users = await this.SearchService.getPeople(name, limit, offset)
        if (users) {
          return users;
        } else {
          return new NotFoundException();
        }
      }
      @Get('/board/:name')
      async getBoards(@Request() req, @Param('name') name: string,  @Param('limit') limit: Number, @Param('offset') offset: Number) {
        let boards = await this.SearchService.getBoards(name, limit, offset)
        if (boards) {
          return boards;
        } else {
          return new NotFoundException();
        }
      }
}
