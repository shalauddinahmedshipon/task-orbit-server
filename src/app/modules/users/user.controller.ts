import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
import { sendImageToCloudinary } from '../../utils/uploadToCloudinary';

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
  const { email } = req.user;
  const result = await UserServices.getMyProfileFromDB(email);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User own Profile information retrieve successfully',
    data: result,
  });
});


const updateUserProfile = catchAsync(async (req, res) => {
  const userData = req.user;

  const payload = {
    ...req.body,
  };

  if (req.file) {
    const imageName = `${userData.email}-${Date.now()}`;

    const uploadedImage: any = await sendImageToCloudinary(
      imageName,
      req.file.buffer,
    );

    payload.avatarUrl = uploadedImage.secure_url;
  }

  const result = await UserServices.updateUserProfileFromDB(
    payload,
    userData,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Profile updated successfully',
    data: result,
  });
});


const updateUserByAdmin = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const payload = req.body;

  const loggedInUser = req.user;

  const result = await UserServices.updateUserByAdminFromDB(
    userId,
    payload,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User updated successfully',
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
  updateUserByAdmin
};
