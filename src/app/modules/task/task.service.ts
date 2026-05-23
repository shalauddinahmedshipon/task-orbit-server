import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { TTask } from './task.interface';
import { Task } from './task.model';
import { Sprint } from '../sprint/sprint.model';
import { Project } from '../project/project.model';
import { JwtPayload } from 'jsonwebtoken';
// import { ActivityLog } from '../activityLog/activityLog.model';
import { Types } from 'mongoose';

const createTaskIntoDB = async (
  projectId: string,
  payload: Omit<TTask, 'projectId' | 'createdBy' | 'attachments'>,
  user: JwtPayload,
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
  }

  const sprint = await Sprint.findById(payload.sprintId);
  if (!sprint) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Sprint not found');
  }

  if (sprint.projectId.toString() !== projectId) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Sprint does not belong to this project',
    );
  }

  const result = await Task.create({
    ...payload,
    projectId,
    createdBy: user.userId,
    attachments: [],
  });

  return result;
};

const getAllTasksFromDB = async (query: Record<string, unknown>, user: JwtPayload) => {
  const filter: Record<string, unknown> = {};

  if (query.projectId) filter.projectId = query.projectId;
  if (query.sprintId) filter.sprintId = query.sprintId;
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.assignee) filter.assignees = new Types.ObjectId(query.assignee as string);

  // members only see tasks assigned to them
  if (user.role === 'member') {
    filter.assignees = new Types.ObjectId(user.userId);
  }

  const result = await Task.find(filter)
    .populate('assignees', 'name email avatarUrl department')
    .populate('sprintId', 'title sprintNumber')
    .populate('projectId', 'title')
    .populate('createdBy', 'name email')
    .sort({ updatedAt: -1 });

  return result;
};

const getTasksByProjectFromDB = async (projectId: string, query: Record<string, unknown>, user: JwtPayload) => {
  const filter: Record<string, unknown> = { projectId };

  if (query.sprintId) filter.sprintId = query.sprintId;
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.assignee) filter.assignees = new Types.ObjectId(query.assignee as string);

  if (user.role === 'member') {
    filter.assignees = new Types.ObjectId(user.userId);
  }

  const result = await Task.find(filter)
    .populate('assignees', 'name email avatarUrl department')
    .populate('sprintId', 'title sprintNumber')
    .populate('createdBy', 'name email')
    .sort({ updatedAt: -1 });

  return result;
};

const getTasksBySprintFromDB = async (sprintId: string, user: JwtPayload) => {
  const filter: Record<string, unknown> = { sprintId };

  if (user.role === 'member') {
    filter.assignees = new Types.ObjectId(user.userId);
  }

  const result = await Task.find(filter)
    .populate('assignees', 'name email avatarUrl department')
    .populate('createdBy', 'name email')
    .sort({ priority: -1, updatedAt: -1 });

  return result;
};

const getSingleTaskFromDB = async (taskId: string) => {
  const task = await Task.findById(taskId)
    .populate('assignees', 'name email avatarUrl department')
    .populate('sprintId', 'title sprintNumber startDate endDate')
    .populate('projectId', 'title client')
    .populate('createdBy', 'name email role avatarUrl');

  if (!task) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');
  }
  return task;
};

const updateTaskIntoDB = async (
  taskId: string,
  payload: Partial<TTask>,
  user: JwtPayload,
) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');
  }

  // members can only update status (not full task details)
  if (user.role === 'member') {
    const allowedFields = ['status', 'subtasks'];
    const attemptedFields = Object.keys(payload);
    const hasDisallowed = attemptedFields.some((f) => !allowedFields.includes(f));
    if (hasDisallowed) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'Members can only update status and subtasks',
      );
    }
  }

  // track changed fields for activity log
  const changes: { field: string; oldValue: string; newValue: string }[] = [];
  const trackFields = ['status', 'priority', 'assignees'] as const;
  for (const field of trackFields) {
    if (payload[field] !== undefined) {
      const oldVal = JSON.stringify(task[field]);
      const newVal = JSON.stringify(payload[field]);
      if (oldVal !== newVal) {
        changes.push({ field, oldValue: oldVal, newValue: newVal });
      }
    }
  }

  const result = await Task.findByIdAndUpdate(
    taskId,
    { $set: payload },
    { new: true, runValidators: true },
  )
    .populate('assignees', 'name email avatarUrl department')
    .populate('sprintId', 'title sprintNumber')
    .populate('projectId', 'title');

  // log changes
//   for (const change of changes) {
//     await ActivityLog.create({
//       taskId,
//       userId: user.userId,
//       action: `Updated ${change.field}`,
//       oldValue: change.oldValue,
//       newValue: change.newValue,
//     });
//   }

  return result;
};

const updateTaskStatusIntoDB = async (
  taskId: string,
  status: TTask['status'],
  user: JwtPayload,
) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');
  }

  // members must be assignees
  if (
    user.role === 'member' &&
    !task.assignees.some((a) => a.toString() === user.userId)
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not assigned to this task',
    );
  }

  // if reviewApproval is required, member can only move to 'review', not 'done'
  if (
    task.reviewApproval &&
    user.role === 'member' &&
    status === 'done'
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'This task requires manager approval to move to done',
    );
  }

  const oldStatus = task.status;
  const result = await Task.findByIdAndUpdate(
    taskId,
    { $set: { status } },
    { new: true },
  ).populate('assignees', 'name email avatarUrl department');

//   await ActivityLog.create({
//     taskId,
//     userId: user.userId,
//     action: 'Changed status',
//     oldValue: oldStatus,
//     newValue: status,
//   });

  return result;
};

// Manager approves task from 'review' → 'done'
const approveTaskIntoDB = async (
  taskId: string,
  approved: boolean,
  user: JwtPayload,
) => {
  if (user.role === 'member') {
    throw new AppError(StatusCodes.FORBIDDEN, 'Only managers/admins can approve tasks');
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');
  }

  if (task.status !== 'review') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Task must be in review status to approve',
    );
  }

  const newStatus = approved ? 'done' : 'in-progress';
  const result = await Task.findByIdAndUpdate(
    taskId,
    { $set: { status: newStatus } },
    { new: true },
  );

//   await ActivityLog.create({
//     taskId,
//     userId: user.userId,
//     action: approved ? 'Approved task' : 'Rejected task (sent back to in-progress)',
//     oldValue: 'review',
//     newValue: newStatus,
//   });

  return result;
};

const addAttachmentToTaskIntoDB = async (
  taskId: string,
  attachment: TTask['attachments'][0],
) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');
  }

  const result = await Task.findByIdAndUpdate(
    taskId,
    { $push: { attachments: attachment } },
    { new: true },
  );

  return result;
};

const deleteAttachmentFromTaskIntoDB = async (
  taskId: string,
  publicId: string,
) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');
  }

  const result = await Task.findByIdAndUpdate(
    taskId,
    { $pull: { attachments: { publicId } } },
    { new: true },
  );

  return result;
};

const deleteTaskFromDB = async (taskId: string) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');
  }
  await Task.findByIdAndDelete(taskId);
  return null;
};

export const TaskServices = {
  createTaskIntoDB,
  getAllTasksFromDB,
  getTasksByProjectFromDB,
  getTasksBySprintFromDB,
  getSingleTaskFromDB,
  updateTaskIntoDB,
  updateTaskStatusIntoDB,
  approveTaskIntoDB,
  addAttachmentToTaskIntoDB,
  deleteAttachmentFromTaskIntoDB,
  deleteTaskFromDB,
};