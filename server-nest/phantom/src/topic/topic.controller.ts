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
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from '../shared/http-exception.filter';
import { ImagesService } from '../images/images.service';
import { TopicService } from './topic.service';
import { of, from } from 'rxjs';
@UseFilters(new HttpExceptionFilter())
@Controller()
export class TopicController {
  constructor(
    private TopicService: TopicService,
    private ImageService: ImagesService,
  ) {}
  //get all the topics
  @UseGuards(AuthGuard('jwt'))
  @Get('/topic')
  async getTopics(@Request() req) {
    let userId = req.user._id;
    let topics = await this.TopicService.getTopics(userId);
    if (topics) {
      return topics;
    } else {
      return NotFoundException;
    }
  }
  //get a certain topic
  @UseGuards(AuthGuard('jwt'))
  @Get('/topic/:topicId')
  async getTopic(@Request() req, @Param('topicId') topicId: string) {
    let userId = req.user._id;
    let topic = await this.TopicService.getTopicById(topicId, userId);
    if (topic) {
      return topic;
    } else {
      return NotFoundException;
    }
  }
  //get all pins of a certain topic
  @UseGuards(AuthGuard('jwt'))
  @Get('/topic/:topicId/pins')
  async getPinsOfAtopic(
    @Request() req,
    @Param('topicId') topicId: string,
    @Query('limit') limit: Number,
    @Query('offset') offset: Number,
  ) {
    let userId = req.user._id;
    let pins = await this.TopicService.getPinsOfTopic(
      topicId,
      limit,
      offset,
      userId,
    );
    if (pins && pins.length != 0) {
      return pins;
    } else {
      return NotFoundException;
    }
  }
  //add pin to a certain topic
  @UseGuards(AuthGuard('jwt'))
  @Post('/topic/addPin')
  async addPinToAtopic(
    @Body('pinId') pinId: string,
    @Body('topicId') topicId: string,
  ) {
    let topics = await this.TopicService.addPinToTopic(topicId, pinId);
    if (topics) {
      return { message: 'pin has been added successfully!' };
    } else {
      return ForbiddenException;
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('/createTopic')
  async createTopic(
    @Request() req,
    @Body('imageId') imageId: string,
    @Body('imageHeight') imageHeight: number,
    @Body('imageWidth') imageWidth: number,
    @Body('name') name: string,
    @Body('description') description: string,
  ) {
    let userId = req.user._id;
    let topic = await this.TopicService.createTopic(
      imageId,
      description,
      imageWidth,
      imageHeight,
      name,
    );
    if (topic) {
      return topic;
    } else {
      await this.ImageService.deleteFile(imageId);
      return ForbiddenException;
    }
  }
}
