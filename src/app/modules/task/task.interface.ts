import { Types } from 'mongoose';

export type TTaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TPriorityStatus = 'low' | 'medium' | 'high';

export type TSubtask = {
  _id?: Types.ObjectId;
  title: string;
  isComplete: boolean;
};

export type TAttachment = {
  url: string;
  publicId: string;
  type: string;
  fileName: string;
  size: string;
};

export type TTask = {
  title: string;
  description: string;
  sprintId: Types.ObjectId;
  projectId: Types.ObjectId;
  assignees: Types.ObjectId[];
  estimatedHours: number;
  status: TTaskStatus;
  attachments: TAttachment[];
  subtasks: TSubtask[];
  priority: TPriorityStatus;
  reviewApproval: boolean;
  dueDate: Date;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};
