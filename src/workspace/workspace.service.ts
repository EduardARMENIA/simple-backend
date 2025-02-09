import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { Workspace } from '../models/workspace.schema';
import { CreateWorkspaceDto } from '../dto/create.workspace.dto';
import { User } from '../models/user.schema';
@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}


  async isSlugTaken(slug: string): Promise<any> {
    const workspace = await this.workspaceModel.findOne({ slug });

    if (workspace) {
      return true
    }
    return false
  }

  async createWorkspace(createWorkspaceDto: CreateWorkspaceDto): Promise<any> {
    const newWorkspace =  new this.workspaceModel(createWorkspaceDto);

    await this.userModel.findByIdAndUpdate(
      createWorkspaceDto.userId,
      { $push: { workspaces: newWorkspace._id } },
      { new: true }
    );

    return await newWorkspace.save();
  }


  async getAllWorkspaces(): Promise<any[]> {
    const workspaceData = await this.workspaceModel.find();

    if (!workspaceData || workspaceData.length == 0) {
      throw new NotFoundException('Workspaces data not found!');
    }
    return workspaceData;
  }

  async getSWorkspaceByUserId(userId: string): Promise<any> {
    const existingWorkspace = await this.workspaceModel
      .find({userId})
      .exec();

    if (!existingWorkspace) {
      throw new NotFoundException(`Workspace #${userId} not found`);
    }
    return existingWorkspace;
  }

  async deleteWorkspace(workspaceId: string): Promise<any> {
    const deletedWorkspace = await this.workspaceModel.findByIdAndDelete(workspaceId);

    if (!deletedWorkspace) {
      throw new NotFoundException(`Workspace #${workspaceId} not found`);
    }
    return deletedWorkspace;
  }
}