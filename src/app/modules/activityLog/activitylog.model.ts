import { model, Schema } from 'mongoose';
import { TActivityLog } from './activityLog.interface';

const activityLogSchema = new Schema<TActivityLog>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    oldValue: { type: String },
    newValue: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const ActivityLog = model<TActivityLog>('ActivityLog', activityLogSchema);