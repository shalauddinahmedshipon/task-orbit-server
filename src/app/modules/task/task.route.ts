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



//update task (admin/manager)
router.patch(
  '/:taskId',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(taskValidation.updateTaskValidationSchema),
  TaskControllers.updateTask,
);






// Status update (separate endpoint — members use this)
router.patch(
  '/:taskId/status',
  auth( USER_ROLE.member),
  validateRequest(taskValidation.updateTaskStatusValidationSchema),
  TaskControllers.updateTaskStatus,
);

// Manager review task approval 
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
  '/:taskId',
  auth(USER_ROLE.admin, USER_ROLE.manager),
  TaskControllers.deleteTask,
);

router.delete(
  '/:taskId/attachments',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  TaskControllers.deleteAttachment,
);

export const taskRoutes = router;