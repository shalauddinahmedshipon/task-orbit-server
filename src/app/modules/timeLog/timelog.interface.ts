import { Types } from 'mongoose';

export type TTimeLog = {
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
  hours: number;
  logDate: Date;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};