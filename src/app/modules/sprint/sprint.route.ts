import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { sprintValidation } from './sprint.validation';
import { SprintControllers } from './sprint.controller';

const router = Router({ mergeParams: true }); // mergeParams for /projects/:projectId/sprints

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(sprintValidation.createSprintValidationSchema),
  SprintControllers.createSprint,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  SprintControllers.getSprintsByProject,
);

router.get(
  '/:sprintId',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  SprintControllers.getSingleSprint,
);

router.patch(
  '/:sprintId',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(sprintValidation.updateSprintValidationSchema),
  SprintControllers.updateSprint,
);

router.delete(
  '/:sprintId',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  SprintControllers.deleteSprint,
);

export const sprintRoutes = router;