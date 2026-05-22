import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const createUser = catchAsync(async (req, res) => {
  const user = req.body;
  const result = await UserServices.createUserIntoDB(user);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'User created successfully',
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'All User retrieve successfully',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.getSingleUserFromDB(userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User retrieves successfully',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const { email, role } = req.user;
  const result = await UserServices.getMyProfileFromDB(email, role);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User own Profile information retrieve successfully',
    data: result,
  });
});

const updateUserProfile = catchAsync(async (req, res) => {
  const userData = req.user;
  const payload = req.body;
  const result = await UserServices.updateUserProfileFromDB(payload, userData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Update User Profile successfully',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const { userId, status } = req.body;
  const payload = req.user;
  const result = await UserServices.changeStatusFromDB(status, userId, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Update user status successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.deleteUserFromDB(userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUserProfile,
  deleteUser,
  getMyProfile,
  changeStatus,
};
