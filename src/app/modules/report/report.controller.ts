import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReportServices } from './report.service';

const getProjectReport = catchAsync(async (req, res) => {
  const result = await ReportServices.getProjectReport(req.params.projectId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Project report retrieved successfully',
    data: result,
  });
});

const getUserReport = catchAsync(async (req, res) => {
  const userId = req.params.userId || req.user.userId;
  const result = await ReportServices.getUserReport(userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User report retrieved successfully',
    data: result,
  });
});

export const ReportControllers = { getProjectReport, getUserReport };