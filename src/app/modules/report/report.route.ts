import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ReportControllers } from './report.controller';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.get(
  '/project/:projectId',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  ReportControllers.getProjectReport,
);

// Admin/manager can check any user; member checks their own
router.get(
  '/user/:userId',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  ReportControllers.getUserReport,
);

router.get(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  ReportControllers.getUserReport,
);

export const reportRoutes = router;