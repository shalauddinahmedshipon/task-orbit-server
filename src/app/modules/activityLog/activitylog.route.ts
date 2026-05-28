import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { ActivityLogControllers } from './activitylog.controller';

const router = Router();

router.get(
  '/task/:taskId',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  ActivityLogControllers.getActivityLogsByTask,
);

export const activityLogRoutes = router;
