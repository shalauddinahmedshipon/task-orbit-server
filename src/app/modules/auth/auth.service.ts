/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { User } from '../users/user.model';
import { TLogin } from './auth.interface';
import { createToken } from './auth.utils';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';

const loginUser = async (payload: TLogin) => {
  const user = await User.isUserExistByEmail(payload.email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is not Exist');
  }
  if (await User.isUserBlog(user.status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is Blocked!');
  }
  if (!(await User.isPasswordMatch(payload?.password, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Wrong Password!');
  }
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.access_token_expiresIn as string,
  );



  return {
    accessToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePasswordIntoDB = async (
  userData: JwtPayload,
  payload: {
    confirmPassword: string;
    newPassword: string;
    oldPassword: string;
  },
) => {
  const isUserExist = await User.isUserExistByEmail(userData?.email);
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is not Exist');
  }
  if (await User.isUserBlog(isUserExist.status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is Blocked!');
  }
  if (
    !(await User.isPasswordMatch(payload?.oldPassword, isUserExist?.password))
  ) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Wrong Password!');
  }

  if (payload?.newPassword !== payload?.confirmPassword) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'New Password and Confirm Password is not Match!',
    );
  }

  const updatedPassword = await bcrypt.hash(
    payload?.newPassword as string,
    Number(config.bcrypt_solt),
  );

  await User.findOneAndUpdate(
    { email: userData?.email, role: userData?.role },
    {
      $set: {
        password: updatedPassword,
        passwordChangedAt: new Date(),
        needsPasswordChange: false,
      },
    },
    { new: true },
  );

  return null;
};

const refreshToken = async (token: string) => {
  let decoded;
  try {
    decoded = jwt.verify(
      token,
      config.jwt_refresh_secret as string,
    ) as JwtPayload;
  } catch (error) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not Authorized!');
  }
  const { email, iat } = decoded;

  const user = await User.isUserExistByEmail(email);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is not Exist');
  }
  if (await User.isUserBlog(user.status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is Blocked!');
  }

  if (
    user.passwordChangedAt &&
    (await User.isJWTIssuedBeforePasswordChanged(
      user.passwordChangedAt,
      iat as number,
    ))
  ) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not Authorized!');
  }
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.access_token_expiresIn as string,
  );
  return { accessToken };
};

const forgetPassword = async (email: string) => {
  const user = await User.isUserExistByEmail(email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is not Exist');
  }
  if (await User.isUserBlog(user.status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is Blocked!');
  }
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );
  const resetUILink = `${config.reset_pass_ui_link}?id=${user?._id as string}&token=${resetToken}`;
  sendEmail(user.email, resetUILink);
  return null;
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  const user = await User.isUserExistByEmail(payload.email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is not Exist');
  }
  if (await User.isUserBlog(user.status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is Blocked!');
  }

  let decoded;
  try {
    decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
  } catch (error) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not Authorized!');
  }
  const { email, role } = decoded;
  if (payload.email !== email) {
    throw new AppError(StatusCodes.FORBIDDEN, 'You are not Forbidden!');
  }
  const updatedPassword = await bcrypt.hash(
    payload?.newPassword as string,
    Number(config.bcrypt_solt),
  );

  await User.findOneAndUpdate(
    { email, role },
    {
      $set: {
        password: updatedPassword,
        passwordChangedAt: new Date(),
        needsPasswordChange: false,
      },
    },
    { new: true },
  );
};

export const authServices = {
  loginUser,
  changePasswordIntoDB,
  refreshToken,
  forgetPassword,
  resetPassword,
};
