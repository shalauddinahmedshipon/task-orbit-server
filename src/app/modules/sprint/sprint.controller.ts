import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SprintServices } from './sprint.service';

const createSprint = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await SprintServices.createSprintIntoDB(projectId, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Sprint created successfully',
    data: result,
  });
});

const getSprintsByProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await SprintServices.getSprintsByProjectFromDB(projectId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Sprints retrieved successfully',
    data: result,
  });
});

const getSingleSprint = catchAsync(async (req, res) => {
  const { sprintId } = req.params;
  const result = await SprintServices.getSingleSprintFromDB(sprintId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Sprint retrieved successfully',
    data: result,
  });
});

const updateSprint = catchAsync(async (req, res) => {
  const { sprintId } = req.params;
  const result = await SprintServices.updateSprintIntoDB(sprintId, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Sprint updated successfully',
    data: result,
  });
});

const deleteSprint = catchAsync(async (req, res) => {
  const { sprintId } = req.params;
  await SprintServices.deleteSprintFromDB(sprintId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Sprint deleted successfully',
    data: null,
  });
});

export const SprintControllers = {
  createSprint,
  getSprintsByProject,
  getSingleSprint,
  updateSprint,
  deleteSprint,
};