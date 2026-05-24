
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { Task } from '../task/task.model';
import { TimeLog } from './timelog.model';

const createTimeLog = async (
  taskId: string,
  userId: string,
  payload: { hours: number; logDate: string; description?: string },
) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');

  return TimeLog.create({ taskId, userId, ...payload, logDate: new Date(payload.logDate) });
};

const getTimeLogsByTask = async (taskId: string) => {
  return TimeLog.find({ taskId })
    .populate('userId', 'name avatar')
    .sort({ logDate: -1 });
};

const getMyTimeLogs = async (userId: string) => {
  return TimeLog.find({ userId })
    .populate('taskId', 'title projectId')
    .sort({ logDate: -1 });
};

const updateTimeLog = async (
  logId: string,
  userId: string,
  payload: { hours?: number; logDate?: string; description?: string },
) => {
  const log = await TimeLog.findById(logId);
  if (!log) throw new AppError(StatusCodes.NOT_FOUND, 'Time log not found');

  if (log.userId.toString() !== userId)
    throw new AppError(StatusCodes.FORBIDDEN, 'You can only edit your own logs');

  Object.assign(log, {
    ...payload,
    ...(payload.logDate ? { logDate: new Date(payload.logDate) } : {}),
  });

  return log.save();
};

const deleteTimeLog = async (logId: string, userId: string, role: string) => {
  const log = await TimeLog.findById(logId);
  if (!log) throw new AppError(StatusCodes.NOT_FOUND, 'Time log not found');

  const isOwner = log.userId.toString() === userId;
  const isAdminOrManager = role === 'admin' || role === 'manager';

  if (!isOwner && !isAdminOrManager)
    throw new AppError(StatusCodes.FORBIDDEN, 'Not authorized');

  await TimeLog.findByIdAndDelete(logId);
  return null;
};

export const TimeLogServices = {
  createTimeLog,
  getTimeLogsByTask,
  getMyTimeLogs,
  updateTimeLog,
  deleteTimeLog,
};