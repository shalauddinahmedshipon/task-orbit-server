import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ReportControllers } from './report.controller';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

// Project report — admin/manager only
router.get(
  '/project/:projectId',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  ReportControllers.getProjectReport,
);

router.get(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  ReportControllers.getUserReport,
);

// Any user's report — admin/manager only; optional ?projectId= filter
router.get(
  '/user/:userId',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  ReportControllers.getUserReport,
);

export const reportRoutes = router;
