/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { User } from '../user/user.model';
import { TLogin } from './auth.interface';
import { createToken } from './auth.utils';
import config from '../../config';
import { ObjectId } from 'mongoose';
import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';

const loginUser = async (payload: TLogin) => {
  const user = await User.isUserExistByEmail(payload.email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Invalid Credential');
  }
  if (await User.isUserBlog(user.status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is Blocked!');
  }
  if (!(await User.isPasswordMatch(payload?.password, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Invalid Credential!');
  }
  const jwtPayload = {
    userId:user._id,
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
   needsPasswordChange: user.needsPasswordChange,

   user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl:user.avatarUrl
   }
}
};


const changePasswordIntoDB = async (
  userData: JwtPayload,
  payload: {
    oldPassword: string;
    newPassword: string;
  },
) => {

  const user = await User.isUserExistByEmail(userData.email);

  if (!user) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'User does not exist',
    );
  }

  if (await User.isUserBlog(user.status)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'User is blocked',
    );
  }

  const isOldPasswordMatched =
    await User.isPasswordMatch(
      payload.oldPassword,
      user.password,
    );

  if (!isOldPasswordMatched) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'Old password is incorrect',
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_solt),
  );

  await User.findOneAndUpdate(
    {
      email: userData.email,
    },
    {
      password: hashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

 const getMe=async(email:string)=>{
     const user = await User.findOne({email});
     if(!user){
      throw new AppError(StatusCodes.NOT_FOUND,'User not found!');
     }
     return user;
  }

export const authServices = {
  loginUser,
  getMe,
  changePasswordIntoDB
  
};
