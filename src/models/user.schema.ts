import mongoose, { Document } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Workspace } from './workspace.schema';

@Schema({
  timestamps: true
})
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Workspace' })
  workspaces: Workspace[];
}

export const UserSchema = SchemaFactory.createForClass(User);
