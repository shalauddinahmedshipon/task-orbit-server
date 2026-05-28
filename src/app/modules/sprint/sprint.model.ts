import { model, Schema } from 'mongoose';
import { TSprint } from './sprint.interface';

const sprintSchema = new Schema<TSprint>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    sprintNumber: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Ensure unique sprint number per project
sprintSchema.index({ projectId: 1, sprintNumber: 1 }, { unique: true });

export const Sprint = model<TSprint>('Sprint', sprintSchema);
