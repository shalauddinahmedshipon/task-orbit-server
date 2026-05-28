import { model, Schema } from 'mongoose';
import { TTimeLog } from './timelog.interface';

const timeLogSchema = new Schema<TTimeLog>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hours: { type: Number, required: true, min: 0.1 },
    logDate: { type: Date, required: true },
    description: { type: String, trim: true },
  },
  { timestamps: true },
);

export const TimeLog = model<TTimeLog>('TimeLog', timeLogSchema);
