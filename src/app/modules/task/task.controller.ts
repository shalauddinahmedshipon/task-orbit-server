import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TaskServices } from './task.service';
import { sendImageToCloudinary } from '../../utils/uploadToCloudinary';

const createTask = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await TaskServices.createTaskIntoDB(projectId, req.body, req.user);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Task created successfully',
    data: result,
  });
});

const getAllTasks = catchAsync(async (req, res) => {
  const result = await TaskServices.getAllTasksFromDB(req.query, req.user);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Tasks retrieved successfully',
    data: result,
  });
});

const getTasksByProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await TaskServices.getTasksByProjectFromDB(projectId, req.query, req.user);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Project tasks retrieved successfully',
    data: result,
  });
});

const getTasksBySprint = catchAsync(async (req, res) => {
  const { sprintId } = req.params;
  const result = await TaskServices.getTasksBySprintFromDB(sprintId, req.user);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Sprint tasks retrieved successfully',
    data: result,
  });
});

const getSingleTask = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const result = await TaskServices.getSingleTaskFromDB(taskId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Task retrieved successfully',
    data: result,
  });
});

const updateTask = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const result = await TaskServices.updateTaskIntoDB(taskId, req.body, req.user);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Task updated successfully',
    data: result,
  });
});

const updateTaskStatus = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const result = await TaskServices.updateTaskStatusIntoDB(taskId, status, req.user);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Task status updated successfully',
    data: result,
  });
});

const approveTask = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const { approved } = req.body;
  const result = await TaskServices.approveTaskIntoDB(taskId, approved, req.user);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: `Task ${approved ? 'approved' : 'rejected'} successfully`,
    data: result,
  });
});

const addAttachment = catchAsync(async (req, res) => {
  const { taskId } = req.params;

  if (!req.file) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'No file uploaded',
      data: null,
    });
  }

  const fileName = req.file.originalname;
  const size = `${(req.file.size / 1024).toFixed(2)} KB`;
  const type = req.file.mimetype;
  const uploadName = `task-attachment-${taskId}-${Date.now()}`;

  const uploaded: any = await sendImageToCloudinary(uploadName, req.file.buffer);

  const attachment = {
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
    type,
    fileName,
    size,
  };

  const result = await TaskServices.addAttachmentToTaskIntoDB(taskId, attachment);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Attachment added successfully',
    data: result,
  });
});

const deleteAttachment = catchAsync(async (req, res) => {
  const { taskId, publicId } = req.params;
  // publicId from URL may have forward slashes encoded as %2F
  const decodedPublicId = decodeURIComponent(publicId);
  const result = await TaskServices.deleteAttachmentFromTaskIntoDB(taskId, decodedPublicId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Attachment deleted successfully',
    data: result,
  });
});

const deleteTask = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  await TaskServices.deleteTaskFromDB(taskId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Task deleted successfully',
    data: null,
  });
});

export const TaskControllers = {
  createTask,
  getAllTasks,
  getTasksByProject,
  getTasksBySprint,
  getSingleTask,
  updateTask,
  updateTaskStatus,
  approveTask,
  addAttachment,
  deleteAttachment,
  deleteTask,
};