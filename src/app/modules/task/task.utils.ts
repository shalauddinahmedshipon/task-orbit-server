import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import { TTaskStatus } from "./task.interface";
import { USER_ROLE } from "../user/user.constant";

export const validateTaskStatusTransition = (
  currentStatus: TTaskStatus,
  newStatus: TTaskStatus,
  reviewApproval: boolean,
  role: string,
) => {
  const transitions: Record<TTaskStatus, TTaskStatus[]> = {
    todo: ['in-progress'],
    'in-progress': reviewApproval
      ? ['review']
      : ['done'],
    review: ['done', 'in-progress'],
    done: [],
  };

  const allowed = transitions[currentStatus];

  if (!allowed.includes(newStatus)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Cannot move task from ${currentStatus} to ${newStatus}`,
    );
  }

  // members cannot approve
  if (
    role === USER_ROLE.member &&
    currentStatus === 'review' &&
    newStatus === 'done'
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'Manager approval required',
    );
  }
};
