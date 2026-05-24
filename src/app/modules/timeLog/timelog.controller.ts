
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TimeLogServices } from './timelog.service';

const createTimeLog = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.userId;
  const result = await TimeLogServices.createTimeLog(taskId, userId, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Time logged successfully',
    data: result,
  });
});

const getTimeLogsByTask = catchAsync(async (req, res) => {
  const result = await TimeLogServices.getTimeLogsByTask(req.params.taskId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Time logs retrieved successfully',
    data: result,
  });
});

const getMyTimeLogs = catchAsync(async (req, res) => {
  const result = await TimeLogServices.getMyTimeLogs(req.user.userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'My time logs retrieved successfully',
    data: result,
  });
});

const updateTimeLog = catchAsync(async (req, res) => {
  const result = await TimeLogServices.updateTimeLog(
    req.params.logId,
    req.user.userId,
    req.body,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Time log updated successfully',
    data: result,
  });
});

const deleteTimeLog = catchAsync(async (req, res) => {
  await TimeLogServices.deleteTimeLog(req.params.logId, req.user.userId, req.user.role);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Time log deleted successfully',
    data: null,
  });
});

export const TimeLogControllers = {
  createTimeLog,
  getTimeLogsByTask,
  getMyTimeLogs,
  updateTimeLog,
  deleteTimeLog,
};