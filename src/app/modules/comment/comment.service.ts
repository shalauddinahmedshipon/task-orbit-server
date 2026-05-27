
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { Task } from '../task/task.model';
import { Comment } from './comment.model';

const createComment = async (
  taskId: string,
  userId: string,
  message: string,
) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');

  const comment = await Comment.create({ taskId, userId, message });
  return comment.populate('userId', 'name avatarUrl');
};

const getCommentsByTask = async (taskId: string) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');

  return Comment.find({ taskId })
    .populate('userId', 'name avatarUrl role')
    .sort({ createdAt: 1 });
};

const updateComment = async (
  commentId: string,
  userId: string,
  message: string,
) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new AppError(StatusCodes.NOT_FOUND, 'Comment not found');

  if (comment.userId.toString() !== userId)
    throw new AppError(StatusCodes.FORBIDDEN, 'You can only edit your own comments');

  comment.message = message;
  await comment.save();
  return comment.populate('userId', 'name avatarUrl');
};

const deleteComment = async (commentId: string, userId: string, role: string) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new AppError(StatusCodes.NOT_FOUND, 'Comment not found');

  const isOwner = comment.userId.toString() === userId;
  const isAdminOrManager = role === 'admin' || role === 'manager';

  if (!isOwner && !isAdminOrManager)
    throw new AppError(StatusCodes.FORBIDDEN, 'Not authorized to delete this comment');

  await Comment.findByIdAndDelete(commentId);
  return null;
};

export const CommentServices = {
  createComment,
  getCommentsByTask,
  updateComment,
  deleteComment,
};