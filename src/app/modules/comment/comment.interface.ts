import { Types } from 'mongoose';

export type TComment = {
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
};
