import { Types } from 'mongoose';

export type TSprint = {
  title: string;
  sprintNumber: number;
  startDate: Date;
  endDate: Date;
  projectId: Types.ObjectId;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
};