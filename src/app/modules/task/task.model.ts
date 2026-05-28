import { model, Schema } from 'mongoose';
import { TTask } from './task.interface';

const subtaskSchema = new Schema(
  {
    title: { type: String, required: true },
    isComplete: { type: Boolean, default: false },
  },
  { _id: true },
);

const attachmentSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    type: { type: String, required: true },
    fileName: { type: String, required: true },
    size: { type: String, required: true },
  },
  { _id: false },
);

const taskSchema = new Schema<TTask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    sprintId: {
      type: Schema.Types.ObjectId,
      ref: 'Sprint',
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    assignees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    estimatedHours: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'review', 'done'],
      default: 'todo',
    },
    attachments: [attachmentSchema],
    subtasks: [subtaskSchema],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    reviewApproval: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Task = model<TTask>('Task', taskSchema);
