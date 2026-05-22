// import { StatusCodes } from 'http-status-codes';
// import catchAsync from '../../utils/catchAsync';
// import sendResponse from '../../utils/sendResponse';
// import { projectService } from './project.service';
// import AppError from '../../error/AppError';


// const createProject = catchAsync(async (req, res) => {
//   const payload = req.body;
//   const result = await projectService.createProjectIntoDB(payload);
//   sendResponse(res, {
//     statusCode: StatusCodes.CREATED,
//     message: 'Project created successfully',
//     data: result,
//   });
// });


// const getAllProjects = catchAsync(async (req, res) => {
//   const result = await projectService.getAllProjectsFromDB(req.query);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     message: 'All Projects retrieve successfully',
//     meta: result?.meta,
//     data: result?.data,
//   });
// });

// const searchProjects=catchAsync(async(req,res)=>{
//   const {searchTerm}=req.query;
//   if(!searchTerm){
//     throw new AppError(StatusCodes.BAD_REQUEST,"query is required!")
//   }
//   const result =await projectService.searchProjectsFromD(searchTerm as string);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     message: 'Project retrieve successfully',
//     data: result
//   });
// })


// const getSingleProject = catchAsync(async (req, res) => {
//   const { projectId } = req.params;
//   const result = await projectService.getSingleProjectFromDB(projectId);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     message: 'Project retrieve successfully',
//     data: result,
//   });
// });

// const updateProject = catchAsync(async (req, res) => {
//   const { projectId } = req.params;
//   const payload = req.body;
//   const result = await projectService.updateProjectIntoDB(projectId, payload);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     message: 'Project is updated successfully',
//     data: result,
//   });
// });

// const deleteProject = catchAsync(async (req, res) => {
//   const { projectId } = req.params;
//   const result = await projectService.deleteProjectFromDB(projectId);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     message: 'Project is deleted successfully',
//     data: result,
//   });
// });

// export const projectController = {
//   createProject,
//   getAllProjects,
//   getSingleProject,
//   updateProject,
//   deleteProject,
//   searchProjects
// };
