import { Types } from 'mongoose';

export type TActivityLog = {
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
  action: string;
  oldValue?: string;
  newValue?: string;
  createdAt?: Date;
};