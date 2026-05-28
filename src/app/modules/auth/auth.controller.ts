import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);

  const { accessToken, needsPasswordChange, user } = result;

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.node_env === 'production',
    sameSite: 'none',
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User login successfully',
    data: {
      user,
      needsPasswordChange,
    },
  });
});

const logoutUser = catchAsync(async (req, res) => {
  res.clearCookie('accessToken', {
  httpOnly: true,
  secure: config.node_env === 'production',
  sameSite: 'none',
});

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Logout successful',
    data: null,
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = await authServices.getMe(req.user.email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User retrieved successfully',
    data: user,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const userData = req.user;

  const result = await authServices.changePasswordIntoDB(userData, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Password changed successfully',
    data: result,
  });
});

export const authControllers = {
  loginUser,
  logoutUser,
  getMe,
  changePassword,
};
