import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CommentServices } from './comment.service';

const createComment = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.userId;
  const { message } = req.body;

  const result = await CommentServices.createComment(taskId, userId, message);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Comment added successfully',
    data: result,
  });
});

const getCommentsByTask = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const result = await CommentServices.getCommentsByTask(taskId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Comments retrieved successfully',
    data: result,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.userId;
  const { message } = req.body;

  const result = await CommentServices.updateComment(
    commentId,
    userId,
    message,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Comment updated successfully',
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.userId;
  const role = req.user.role;

  await CommentServices.deleteComment(commentId, userId, role);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Comment deleted successfully',
    data: null,
  });
});

export const CommentControllers = {
  createComment,
  getCommentsByTask,
  updateComment,
  deleteComment,
};
