import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.service';
import config from '../../config';
import AppError from '../../error/AppError';

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);

  const { refreshToken, accessToken, needsPasswordChange } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    // sameSite:'none',
    // maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User login successfully',
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const userData = req.user;
  const passwordData = req.body;
  const result = await authServices.changePasswordIntoDB(
    userData,
    passwordData,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Password is changed successfully',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'access token is retrieve successfully',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const email = req.body.email;
  const result = await authServices.forgetPassword(email);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reset link is generated successfully',
    data: result,
  });
});
const resetPassword = catchAsync(async (req, res) => {
  const payload = req.body;
  const token = req.headers.authorization;
  if (!token) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not Authorized!');
  }
  const result = await authServices.resetPassword(payload, token);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password is reset successfully',
    data: result,
  });
});

export const authControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
