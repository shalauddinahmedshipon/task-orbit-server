import express from 'express';
import { AuthValidation } from './auth.validation';
import { authControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  authControllers.loginUser,
);
router.post(
  '/change-password',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  authControllers.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  authControllers.refreshToken,
);

router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  authControllers.forgetPassword,
);

router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  authControllers.resetPassword,
);

export const authRoutes = router;
