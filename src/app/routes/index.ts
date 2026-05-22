import { Router } from 'express';
import { userRoutes } from '../modules/users/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
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
  // {
  //   path: '/projects',
  //   route: projectRoutes,
  // }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
