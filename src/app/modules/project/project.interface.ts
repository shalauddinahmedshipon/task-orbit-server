import { Types } from 'mongoose';

export type TProjectStatus = 'planned' | 'active' | 'completed' | 'archived';

export type TProject = {
  title: string;
  thumbnail?: string;
  client: string;
  description: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  status: TProjectStatus;
  members: Types.ObjectId[];
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};