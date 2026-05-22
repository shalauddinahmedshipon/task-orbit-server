import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userValidation } from './user.validation';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = Router();
router.post(
  '/create-user',
  auth(USER_ROLE.superAdmin),
  validateRequest(userValidation.createUserValidationSchema),
  UserControllers.createUser,
);
router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserControllers.getAllUser,
);
router.get(
  '/my-profile',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserControllers.getMyProfile,
);
router.get(
  '/:userId',
  auth(USER_ROLE.superAdmin),
  UserControllers.getSingleUser,
);
router.patch(
  '/update-profile',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(userValidation.updateUserProfileValidationSchema),
  UserControllers.updateUserProfile,
);
router.patch(
  '/change-status',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(userValidation.updateUserStatusValidationScheme),
  UserControllers.changeStatus,
);
router.delete(
  '/:userId',
  auth(USER_ROLE.superAdmin),
  UserControllers.deleteUser,
);

export const userRoutes = router;
