import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true
})
export class Workspace extends Document{
  @Prop({type: Types.ObjectId})
  userID: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  slug: string;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);