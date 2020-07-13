import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { board } from '../types/board';
import { UserService } from 'src/shared/user.service';
@Injectable()
export class BoardService {
  constructor(
    @InjectModel('Board') private readonly boardModel: Model<board>,
    private UserService: UserService,
  ) {}
}
