import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { timeLogValidation } from './timelog.validation';
import { TimeLogControllers } from './timelog.controller';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/task/:taskId',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  validateRequest(timeLogValidation.createTimeLogValidationSchema),
  TimeLogControllers.createTimeLog,
);

router.get(
  '/task/:taskId',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  TimeLogControllers.getTimeLogsByTask,
);

router.get(
  '/my',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  TimeLogControllers.getMyTimeLogs,
);

router.patch(
  '/:logId',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  validateRequest(timeLogValidation.updateTimeLogValidationSchema),
  TimeLogControllers.updateTimeLog,
);

router.delete(
  '/:logId',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  TimeLogControllers.deleteTimeLog,
);

export const timeLogRoutes = router;