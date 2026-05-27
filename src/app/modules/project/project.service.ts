import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { TProject } from './project.interface';
import { Project } from './project.model';
import { JwtPayload } from 'jsonwebtoken';
import { Task } from '../task/task.model';
import { Types } from 'mongoose';

const createProjectIntoDB = async (payload: TProject, user: JwtPayload) => {
  const result = await Project.create({ ...payload, createdBy: user.userId });
  return result;
};

const getAllProjectsFromDB = async (
  query: Record<string, unknown>,
  user: JwtPayload,
) => {
  const filter: Record<string, unknown> = {};

  if (query.status) filter.status = query.status;
  if (query.client)
    filter.client = { $regex: query.client as string, $options: 'i' };

  // members only see their own projects
  if (user.role === 'member') {
    filter.members = new Types.ObjectId(user.userId);
  }

  const projects = await Project.find(filter)
    .populate('members', 'name email avatarUrl department')
    .populate('createdBy', 'name email role avatar')
    .sort({ updatedAt: -1 });

  // attach task quick stats per project
  const projectIds = projects.map((p) => p._id);
  const taskStats = await Task.aggregate([
    { $match: { projectId: { $in: projectIds } } },
    {
      $group: {
        _id: '$projectId',
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] },
        },
      },
    },
  ]);

  const statsMap: Record<string, { total: number; completed: number }> = {};
  taskStats.forEach((s) => {
    statsMap[s._id.toString()] = { total: s.total, completed: s.completed };
  });

  const result = projects.map((p) => ({
    ...p.toObject(),
    taskStats: statsMap[p._id.toString()] ?? { total: 0, completed: 0 },
  }));

  return result;
};

const getSingleProjectFromDB = async (
  projectId: string,
  user: JwtPayload,
) => {
  const project = await Project.findById(projectId)
    .populate('members', 'name email avatarUrl department role')
    .populate('createdBy', 'name email avatarUrl role');

  if (!project) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
  }

  // members can only view projects they belong to
  if (
    user.role === 'member' &&
    !project.members.some((m: any) => m._id.toString() === user.userId)
  ) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Access denied');
  }

  // task stats
  const [stats] = await Task.aggregate([
    {
      $match: {
        projectId: new Types.ObjectId(projectId),
      },
    },
    {
      $group: {
        _id: '$projectId',

        total: { $sum: 1 },

        completed: {
          $sum: {
            $cond: [{ $eq: ['$status', 'done'] }, 1, 0],
          },
        },

        inProgress: {
          $sum: {
            $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0],
          },
        },

        review: {
          $sum: {
            $cond: [{ $eq: ['$status', 'review'] }, 1, 0],
          },
        },

        todo: {
          $sum: {
            $cond: [{ $eq: ['$status', 'todo'] }, 1, 0],
          },
        },
      },
    },
  ]);

  return {
    ...project.toObject(),
    taskStats: stats ?? {
      total: 0,
      completed: 0,
      inProgress: 0,
      review: 0,
      todo: 0,
    },
  };
};

const updateProjectIntoDB = async (
  projectId: string,
  payload: Partial<TProject>,
  user: JwtPayload,
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
  }



  const result = await Project.findByIdAndUpdate(
    projectId,
    { $set: payload },
    { new: true, runValidators: true },
  )
    .populate('members', 'name email avatarUrl department')
    .populate('createdBy', 'name email role');

  return result;
};

const deleteProjectFromDB = async (projectId: string) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
  }
  await Project.findByIdAndDelete(projectId);
  return null;
};


const addMembersToProjectIntoDB = async (
  projectId: string,
  memberIds: string[],
) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
  }

  // existing member ids as string
  const existingMembers = project.members.map((m) => m.toString());

  // remove already existing members
  const newMemberIds = memberIds.filter(
    (id) => !existingMembers.includes(id),
  );

  if (newMemberIds.length === 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'All members already exist in this project',
    );
  }

  const memberObjectIds = newMemberIds.map(
    (id) => new Types.ObjectId(id),
  );

  const result = await Project.findByIdAndUpdate(
    projectId,
    {
      $push: {
        members: {
          $each: memberObjectIds,
        },
      },
    },
    { new: true },
  ).populate('members', 'name email avatarUrl department');

  return result;
};

const removeMemberFromProjectIntoDB = async (
  projectId: string,
  memberId: string,
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
  }

  const result = await Project.findByIdAndUpdate(
    projectId,
    { $pull: { members: new Types.ObjectId(memberId) } },
    { new: true },
  ).populate('members', 'name email avatarUrl department');

  return result;
};

export const ProjectServices = {
  createProjectIntoDB,
  getAllProjectsFromDB,
  getSingleProjectFromDB,
  updateProjectIntoDB,
  deleteProjectFromDB,
  addMembersToProjectIntoDB,
  removeMemberFromProjectIntoDB,
};