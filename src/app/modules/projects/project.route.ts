// import { Router } from 'express';
// import { projectController } from './project.controller';
// import validateRequest from '../../middlewares/validateRequest';
// import { projectValidation } from './project.validation';
// import auth from '../../middlewares/auth';
// import { USER_ROLE } from '../users/user.constant';

// const router = Router();

// router.post(
//   '/create-project',
//   auth(USER_ROLE.admin, USER_ROLE.superAdmin),
//   validateRequest(projectValidation.createProjectValidationSchema),
//   projectController.createProject,
// );
// router.get('/search/projects', projectController.searchProjects);
// router.get('/', projectController.getAllProjects);
// router.get('/:projectId', projectController.getSingleProject);
// router.patch(
//   '/:projectId',
//   auth(USER_ROLE.admin, USER_ROLE.superAdmin),
//   validateRequest(projectValidation.updateProjectValidationSchema),
//   projectController.updateProject,
// );
// router.delete(
//   '/:projectId',
//   auth(USER_ROLE.admin, USER_ROLE.superAdmin),
//   projectController.deleteProject,
// );

// export const projectRoutes = router;
