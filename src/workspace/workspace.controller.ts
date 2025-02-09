import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.schema';
import { Model } from 'mongoose';
import { Workspace } from '../models/workspace.schema';

@Controller('workspace')
export class WorkspaceController {
  constructor(
    @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>,
  ) {}

  async create(RegisterDTO: any) {
    // const { email } = RegisterDTO;
    // const user = await this.workspaceModel.findOne({ email });
    // if (user) {
    //   throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    // }
    //
    // const createdUser = new this.workspaceModel({
    //   ...RegisterDTO,
    // });
    //
    // await createdUser.save();
    //
    // return true;
  }
}
