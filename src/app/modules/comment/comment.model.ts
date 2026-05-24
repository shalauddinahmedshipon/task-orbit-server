import { model, Schema } from 'mongoose';
import { TComment } from './comment.interface';

const commentSchema = new Schema<TComment>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const Comment = model<TComment>('Comment', commentSchema);