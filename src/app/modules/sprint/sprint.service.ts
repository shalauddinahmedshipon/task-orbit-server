import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { TSprint } from './sprint.interface';
import { Sprint } from './sprint.model';
import { Project } from '../projects/project.model';

const createSprintIntoDB = async (
  projectId: string,
  payload: Omit<TSprint, 'sprintNumber' | 'projectId'>,
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
  }

  // auto-increment sprint number per project
  const lastSprint = await Sprint.findOne({ projectId }).sort({ sprintNumber: -1 });
  const sprintNumber = lastSprint ? lastSprint.sprintNumber + 1 : 1;

  // default order = last
  const lastOrder = await Sprint.findOne({ projectId }).sort({ order: -1 });
  const order = payload.order ?? (lastOrder ? lastOrder.order + 1 : 1);

  const result = await Sprint.create({
    ...payload,
    projectId,
    sprintNumber,
    order,
  });

  return result;
};

const getSprintsByProjectFromDB = async (projectId: string) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
  }

  const result = await Sprint.find({ projectId }).sort({ order: 1 });
  return result;
};

const getSingleSprintFromDB = async (sprintId: string) => {
  const sprint = await Sprint.findById(sprintId).populate('projectId', 'title');
  if (!sprint) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Sprint not found');
  }
  return sprint;
};

const updateSprintIntoDB = async (
  sprintId: string,
  payload: Partial<TSprint>,
) => {
  const sprint = await Sprint.findById(sprintId);
  if (!sprint) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Sprint not found');
  }

  const result = await Sprint.findByIdAndUpdate(
    sprintId,
    { $set: payload },
    { new: true, runValidators: true },
  );

  return result;
};

const deleteSprintFromDB = async (sprintId: string) => {
  const sprint = await Sprint.findById(sprintId);
  if (!sprint) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Sprint not found');
  }
  await Sprint.findByIdAndDelete(sprintId);
  return null;
};

export const SprintServices = {
  createSprintIntoDB,
  getSprintsByProjectFromDB,
  getSingleSprintFromDB,
  updateSprintIntoDB,
  deleteSprintFromDB,
};