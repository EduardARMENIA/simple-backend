import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({
  timestamps: true
})
export class Workspace extends Document{
  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);