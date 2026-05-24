import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { projectRoutes } from '../modules/project/project.route';
import { sprintRoutes } from '../modules/sprint/sprint.route';
import { taskRoutes } from '../modules/task/task.route';
import { activityLogRoutes } from '../modules/activityLog/activityLog.route';

const router = Router();

const moduleRoutes = [
  
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/projects',
    route: projectRoutes,
  },
  {
    path:'/sprints',
    route:sprintRoutes
  },
  {
    path:'/tasks',
    route:taskRoutes
  },
  {
    path:'/activity-log',
    route:activityLogRoutes
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
