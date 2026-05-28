import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ActivityLogServices } from './activitylog.service';

const getActivityLogsByTask = catchAsync(async (req, res) => {
  const result = await ActivityLogServices.getActivityLogsByTask(
    req.params.taskId,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Activity logs retrieved successfully',
    data: result,
  });
});

export const ActivityLogControllers = { getActivityLogsByTask };
