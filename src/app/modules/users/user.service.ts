import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import { JwtPayload } from 'jsonwebtoken';

const createUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};

const getAllUserFromDB = async () => {
  const result = await User.find();
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  return user;
};

const getMyProfileFromDB = async (email: string, role: string) => {
  const user = await User.findOne({ email, role });
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
  if (user.role === 'superAdmin') {
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
  payload: { name: string; imageUrl?: string },
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
        imageUrl: payload?.imageUrl || user.imageUrl,
      },
    },
    { new: true },
  );
  return result;
};

const deleteUserFromDB = async (userId: string) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  if(isUserExist.role==="superAdmin"){
    throw new AppError(StatusCodes.BAD_REQUEST, 'Super admin can not be deleted!');
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
};
