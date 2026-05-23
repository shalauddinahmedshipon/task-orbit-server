import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { projectValidation } from './project.validation';
import { ProjectControllers } from './project.controller';
import { upload } from '../../config/multer.config';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  upload.single('thumbnail'),
  validateRequest(projectValidation.createProjectValidationSchema),
  ProjectControllers.createProject,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  ProjectControllers.getAllProjects,
);

router.get(
  '/:projectId',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  ProjectControllers.getSingleProject,
);

router.patch(
  '/:projectId',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  upload.single('thumbnail'),
  validateRequest(projectValidation.updateProjectValidationSchema),
  ProjectControllers.updateProject,
);

router.delete(
  '/:projectId',
  auth(USER_ROLE.admin),
  ProjectControllers.deleteProject,
);

router.post(
  '/:projectId/members',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  ProjectControllers.addMember,
);

router.delete(
  '/:projectId/members/:memberId',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  ProjectControllers.removeMember,
);

export const projectRoutes = router;