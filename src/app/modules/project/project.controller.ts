import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProjectServices } from './project.service';
import { sendImageToCloudinary } from '../../utils/uploadToCloudinary';

const createProject = catchAsync(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    const imageName = `project-thumb-${Date.now()}`;
    const uploaded: any = await sendImageToCloudinary(
      imageName,
      req.file.buffer,
    );
    payload.thumbnail = uploaded.secure_url;
  }
  const result = await ProjectServices.createProjectIntoDB(payload, req.user);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Project created successfully',
    data: result,
  });
});

const getAllProjects = catchAsync(async (req, res) => {
  const result = await ProjectServices.getAllProjectsFromDB(
    req.query,
    req.user,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Projects retrieved successfully',
    data: result,
  });
});

const getSingleProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await ProjectServices.getSingleProjectFromDB(
    projectId,
    req.user,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Project retrieved successfully',
    data: result,
  });
});

const updateProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const payload = { ...req.body };
  if (req.file) {
    const imageName = `project-thumb-${projectId}-${Date.now()}`;
    const uploaded: any = await sendImageToCloudinary(
      imageName,
      req.file.buffer,
    );
    payload.thumbnail = uploaded.secure_url;
  }
  const result = await ProjectServices.updateProjectIntoDB(
    projectId,
    payload
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Project updated successfully',
    data: result,
  });
});

const deleteProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  await ProjectServices.deleteProjectFromDB(projectId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Project deleted successfully',
    data: null,
  });
});

const addMembers = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const { memberIds } = req.body;

  const result = await ProjectServices.addMembersToProjectIntoDB(
    projectId,
    memberIds,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Members added to project successfully',
    data: result,
  });
});

const removeMember = catchAsync(async (req, res) => {
  const { projectId, memberId } = req.params;
  const result = await ProjectServices.removeMemberFromProjectIntoDB(
    projectId,
    memberId,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Member removed from project successfully',
    data: result,
  });
});

export const ProjectControllers = {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  addMembers,
  removeMember,
};
