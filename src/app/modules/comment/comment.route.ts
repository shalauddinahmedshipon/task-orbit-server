import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { commentValidation } from './comment.validation';
import { CommentControllers } from './comment.controller';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/task/:taskId',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  validateRequest(commentValidation.createCommentValidationSchema),
  CommentControllers.createComment,
);

router.get(
  '/task/:taskId',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  CommentControllers.getCommentsByTask,
);

router.patch(
  '/:commentId',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  validateRequest(commentValidation.updateCommentValidationSchema),
  CommentControllers.updateComment,
);

router.delete(
  '/:commentId',
  auth(USER_ROLE.admin, USER_ROLE.manager, USER_ROLE.member),
  CommentControllers.deleteComment,
);

export const commentRoutes = router;