import { Task } from '../task/task.model';
import { Sprint } from '../sprint/sprint.model';
import { TimeLog } from '../timeLog/timelog.model';

const getProjectReport = async (projectId: string) => {
  const tasks = await Task.find({ projectId });

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const review = tasks.filter((t) => t.status === 'review').length;
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const percentComplete = total > 0 ? Math.round((done / total) * 100) : 0;

  const taskIds = tasks.map((t) => t._id);
  const timeLogs = await TimeLog.find({ taskId: { $in: taskIds } });
  const totalHoursLogged = timeLogs.reduce((sum, log) => sum + log.hours, 0);

  const sprints = await Sprint.find({ projectId });

  return {
    projectId,
    totalTasks: total,
    tasksByStatus: { todo, inProgress, review, done },
    percentComplete,
    totalHoursLogged: Math.round(totalHoursLogged * 100) / 100,
    totalSprints: sprints.length,
  };
};

const getUserReport = async (userId: string) => {
  const tasks = await Task.find({ assignees: userId }).populate('projectId', 'title');

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const review = tasks.filter((t) => t.status === 'review').length;
  const todo = tasks.filter((t) => t.status === 'todo').length;

  const timeLogs = await TimeLog.find({ userId });
  const totalHoursLogged = timeLogs.reduce((sum, log) => sum + log.hours, 0);

  return {
    userId,
    totalTasksAssigned: total,
    tasksByStatus: { todo, inProgress, review, done },
    totalHoursLogged: Math.round(totalHoursLogged * 100) / 100,
    tasks,
  };
};

export const ReportServices = { getProjectReport, getUserReport };