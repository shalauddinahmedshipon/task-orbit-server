import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { taskValidation } from './task.validation';
import { TaskControllers } from './task.controller';
import { upload } from '../../config/multer.config';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

// Global task list (admin/manager sees all, member sees own)
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  TaskControllers.getAllTasks,
);

// Tasks under a specific project
router.get(
  '/project/:projectId',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  TaskControllers.getTasksByProject,
);

// Tasks under a specific sprint
router.get(
  '/sprint/:sprintId',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  TaskControllers.getTasksBySprint,
);

// Create task under a project
router.post(
  '/project/:projectId',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(taskValidation.createTaskValidationSchema),
  TaskControllers.createTask,
);

// Single task CRUD
router.get(
  '/:taskId',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  TaskControllers.getSingleTask,
);

router.patch(
  '/:taskId',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  validateRequest(taskValidation.updateTaskValidationSchema),
  TaskControllers.updateTask,
);

router.delete(
  '/:taskId',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  TaskControllers.deleteTask,
);

// Status update (separate endpoint — members use this)
router.patch(
  '/:taskId/status',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  validateRequest(taskValidation.updateTaskStatusValidationSchema),
  TaskControllers.updateTaskStatus,
);

// Manager approval
router.patch(
  '/:taskId/approve',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(taskValidation.approveTaskValidationSchema),
  TaskControllers.approveTask,
);

// Attachments
router.post(
  '/:taskId/attachments',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  upload.single('file'),
  TaskControllers.addAttachment,
);

router.delete(
  '/:taskId/attachments/:publicId',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  TaskControllers.deleteAttachment,
);

export const taskRoutes = router;