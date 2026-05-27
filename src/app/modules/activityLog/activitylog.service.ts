import { ActivityLog } from './activitylog.model';

// Call this utility from task service on any meaningful change
export const logActivity = async (payload: {
  taskId: string;
  userId: string;
  action: string;
  oldValue?: string;
  newValue?: string;
}) => {
  await ActivityLog.create(payload);
};

const getActivityLogsByTask = async (taskId: string) => {
  return ActivityLog.find({ taskId })
    .populate('userId', 'name avatarUrl role department')
    .sort({ createdAt: -1 })
    .limit(25);
};

export const ActivityLogServices = { getActivityLogsByTask };