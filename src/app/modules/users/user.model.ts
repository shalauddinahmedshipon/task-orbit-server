import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    imageUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    role: {
      type: String,
      enum: ['superAdmin', 'admin'],
      default: 'admin',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const isAdminExist = await User.findOne({ role: 'superAdmin' });
  if (isAdminExist && this.role === 'superAdmin') {
    throw new AppError(StatusCodes.CONFLICT, 'Super Admin is already Exist!');
  }
  const isUserExist = await User.findOne({ email: this.email });
  if (isUserExist) {
    throw new AppError(StatusCodes.CONFLICT, 'This User is already Exist!');
  }
  this.password = await bcrypt.hash(this.password, Number(config.bcrypt_solt));
  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};
userSchema.statics.isUserBlog = async function (status: string) {
  return status === 'blocked';
};
userSchema.statics.isPasswordMatch = async function (
  plainTextPassword: string,
  hashPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};
userSchema.statics.isJWTIssuedBeforePasswordChanged = async function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
