import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  needsPasswordChange?: boolean;
  passwordChangedAt?: Date;
  imageUrl?: string;
  status: 'in-progress' | 'blocked';
  role: 'superAdmin' | 'admin';
};

export interface UserModel extends Model<TUser> {
  isUserExistByEmail(email: string): Promise<TUser>;
  isUserBlog(status: string): Promise<boolean>;
  isPasswordMatch(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
