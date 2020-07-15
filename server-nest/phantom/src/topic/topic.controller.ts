import {  Controller,
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
import { ImagesService} from '../images/images.service';
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
      @Get('/topic')
      async getTopics() {
        let userId = '5ef10225f775502d20121345';
        let topics = await this.TopicService.getTopics(userId);
        if(topics){
            return topics;
             
        }
        else{
            return NotFoundException;
        } 
      }
      //get a certain topic
      @Get('/topic/:topicId')
      async getTopic(@Param('topicId') topicId: string){
        let userId = '5ef10225f775502d20121345';
        let topic=await this.TopicService.getTopicById(topicId, userId);
        if(topic){
             return topic;
        }
        else{
            return NotFoundException;
        }
      }
      //get all pins of a certain topic
      @Get('/topic/:topicId/pins')
      async getPinsOfAtopic (@Param('topicId') topicId: string, @Query('limit') limit: Number, @Query('offset') offset: Number){
        let userId = '5ef10225f775502d20121345';
        let pins=await this.TopicService.getPinsOfTopic(topicId, limit, offset, userId);
        if(pins&&pins.length!=0){
             return pins;
        }
        else{
            return NotFoundException;
        }
      }
      //add pin to a certain topic
      @Post('/topic/addPin')
      async addPinToAtopic (@Body('pinId') pinId:string, @Body('topicId') topicId:string){
        let topics = await this.TopicService.addPinToTopic(topicId,pinId);
        if(topics){
             return {'message':'pin has been added successfully!'}
        }
        else{
            return ForbiddenException;
        }
    
      }
      @Post('/createTopic')
      async createTopic(
          @Body('imageId') imageId:string,
          @Body('imageHeight') imageHeight:number,
          @Body ('imageWidth') imageWidth:number,
          @Body('name') name:string,
          @Body('description') description:string
          ){
        let userId = '5ef10225f775502d20121345';
        let topic=await this.TopicService.createTopic(imageId, description, imageWidth, imageHeight, name);
        if(topic){
             return topic;
        }
        else{
            await this.ImageService.deleteFile(imageId);
            return ForbiddenException;
        }
    
    }

              
  





    
}
