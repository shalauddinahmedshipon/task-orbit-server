import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { projectRoutes } from '../modules/project/project.route';
import { sprintRoutes } from '../modules/sprint/sprint.route';
// import { projectRoutes } from '../modules/projects/project.route';


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
    route:sprintRoutes
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
