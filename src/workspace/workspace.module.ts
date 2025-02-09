import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Workspace, WorkspaceSchema } from '../models/workspace.schema';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../models/user.schema';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: Workspace.name, schema: WorkspaceSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService]
})


export class WorkspaceModule {}

