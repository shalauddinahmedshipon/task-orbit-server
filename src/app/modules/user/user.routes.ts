import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userValidation } from './user.validation';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { upload } from '../../config/multer.config';


const router = Router();
router.post(
  '/create-user',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(userValidation.createUserValidationSchema),
  UserControllers.createUser,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  UserControllers.getAllUser,
);

router.get(
  '/my-profile',
  auth(USER_ROLE.admin,
   USER_ROLE.manager,
   USER_ROLE.member),
  UserControllers.getMyProfile,
);

router.get(
  '/:userId',
  auth(USER_ROLE.admin,USER_ROLE.manager),
  UserControllers.getSingleUser,
);

router.patch(
  '/update-profile',
  auth(
    USER_ROLE.admin,
    USER_ROLE.manager,
    USER_ROLE.member,
  ),
  upload.single('avatar'),
  UserControllers.updateUserProfile,
);

router.patch(
  '/:userId',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(userValidation.updateUserByAdminValidationSchema),
  UserControllers.updateUserByAdmin,
);

router.delete(
  '/:userId',
  auth(USER_ROLE.admin),
  UserControllers.deleteUser,
);

export const userRoutes = router;
