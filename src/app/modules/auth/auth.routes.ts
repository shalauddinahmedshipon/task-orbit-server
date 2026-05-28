import express from 'express';
import { AuthValidation } from './auth.validation';
import { authControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  authControllers.loginUser,
);

router.post('/logout', authControllers.logoutUser);

router.get(
  '/get-me',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  authControllers.getMe,
);

router.patch(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  authControllers.changePassword,
);

export const authRoutes = router;
