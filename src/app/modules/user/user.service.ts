import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import { JwtPayload } from 'jsonwebtoken';

const createUserIntoDB = async (payload: TUser) => {
  const result = await User.create({ ...payload, needsPasswordChange: true });
  return result;
};

const getAllUserFromDB = async () => {
  const result = await User.find().select('-password');
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  return user;
};

const getMyProfileFromDB = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  return user;
};

const changeStatusFromDB = async (
  status: 'in-progress' | 'blocked',
  userId: string,
  payload: JwtPayload,
) => {
  const { email } = payload;
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  if (payload.email === user.email) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Can not change super admin status!',
    );
  }
  if (email === user.email) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'You can not change your own status!',
    );
  }
  if (user.status === status) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `User status is already ${status}!`,
    );
  }
  const result = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true },
  );
  return result;
};

const updateUserProfileFromDB = async (
  payload: { name: string; avatarUrl?: string },
  userData: JwtPayload,
) => {
  console.log(payload);
  const user = await User.isUserExistByEmail(userData.email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is not Exist');
  }
  if (await User.isUserBlog(user.status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is Blocked!');
  }

  const result = await User.findOneAndUpdate(
    { email: userData.email },
    {
      $set: {
        name: payload?.name || user.name,
        avatarUrl: payload?.avatarUrl || user.avatarUrl,
      },
    },
    { new: true },
  );
  return result;
};

const updateUserByAdminFromDB = async (
  userId: string,
  payload: Partial<TUser>,
  loggedInUser: JwtPayload,
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not exist');
  }

  // nobody can manage admin except admin
  if (user.role === 'admin' && loggedInUser.role !== 'admin') {
    throw new AppError(StatusCodes.FORBIDDEN, 'You cannot manage admin');
  }

  // manager cannot assign admin role
  if (loggedInUser.role === 'manager' && payload.role === 'admin') {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'Manager cannot assign admin role',
    );
  }

  // manager cannot assign manager role
  if (loggedInUser.role === 'manager' && payload.role === 'manager') {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'Manager cannot assign manager role',
    );
  }

  // prevent self blocking
  if (payload.status === 'blocked' && loggedInUser.email === user.email) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'You cannot block yourself');
  }

  const result = await User.findByIdAndUpdate(
    userId,
    {
      $set: payload,
    },
    {
      new: true,
      runValidators: true,
    },
  ).select('-password');

  return result;
};

const deleteUserFromDB = async (userId: string) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  if (isUserExist.role === 'admin') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Admin can not be deleted!');
  }
  const result = await User.findByIdAndDelete(userId);
  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUserFromDB,
  getSingleUserFromDB,
  updateUserProfileFromDB,
  deleteUserFromDB,
  getMyProfileFromDB,
  changeStatusFromDB,
  updateUserByAdminFromDB,
};
