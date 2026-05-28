import { Model } from 'mongoose';

export type TUser = {
  _id?: string;
  name: string;
  email: string;
  password: string;

  needsPasswordChange?: boolean;
  passwordChangedAt?: Date;

  avatarUrl?: string;

  department?: string;

  skills?: string[];

  status: 'in-progress' | 'blocked';

  role: 'admin' | 'manager' | 'member';
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

export type TUserRole = 'admin' | 'manager' | 'member';
