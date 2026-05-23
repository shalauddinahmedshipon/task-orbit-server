import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { TSprint } from './sprint.interface';
import { Sprint } from './sprint.model';
import { Project } from '../project/project.model';

const createSprintIntoDB = async (payload: TSprint) => {
  const { projectId } = payload;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
  }

  const lastSprint = await Sprint.findOne({ projectId }).sort({
    sprintNumber: -1,
  });

  const sprintNumber = lastSprint
    ? lastSprint.sprintNumber + 1
    : 1;

  const lastOrder = await Sprint.findOne({ projectId }).sort({
    order: -1,
  });

  const order =
    payload.order ?? (lastOrder ? lastOrder.order + 1 : 1);

  const result = await Sprint.create({
    ...payload,
    sprintNumber,
    order,
  });

  return result;
};

const getAllSprintsFromDB = async (
  query: Record<string, unknown>,
) => {
  const filter: Record<string, unknown> = {};

  if (query.projectId) {
    filter.projectId = query.projectId;
  }

  const result = await Sprint.find(filter)
    .populate('projectId', 'title')
    .sort({ order: 1 });

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

  if (payload.order) {
  await Sprint.updateMany(
    {
      projectId: sprint.projectId,
      _id: { $ne: sprintId },
      order: { $gte: payload.order },
    },
    {
      $inc: { order: 1 },
    },
  );
}

const updatedData=await Sprint.findById(result?._id);

  return updatedData;
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
  getAllSprintsFromDB,
  getSingleSprintFromDB,
  updateSprintIntoDB,
  deleteSprintFromDB,
};