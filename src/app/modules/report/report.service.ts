import { Task } from '../task/task.model';
import { Sprint } from '../sprint/sprint.model';
import { TimeLog } from '../timeLog/timelog.model';
import { Types } from 'mongoose';

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

const getUserReportFromDB = async (
  userId: string,
  projectId?: string,
) => {
  const uid = new Types.ObjectId(userId);

  const taskFilter: Record<string, unknown> = { assignees: uid };
  if (projectId) taskFilter.projectId = new Types.ObjectId(projectId);

  const taskStats = await Task.aggregate([
    { $match: taskFilter },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const statusMap: Record<string, number> = {
    todo: 0,
    'in-progress': 0,
    review: 0,
    done: 0,
  };
  let total = 0;
  taskStats.forEach((s) => {
    statusMap[s._id] = s.count;
    total += s.count;
  });

  // get task IDs scoped to user (and optionally project)
  const scopedTaskIds = await Task.find(taskFilter).distinct('_id');

  const timeStats = await TimeLog.aggregate([
    {
      $match: {
        userId: uid,
        taskId: { $in: scopedTaskIds }, // ← was ignoring this entirely before
      },
    },
    { $group: { _id: null, totalHours: { $sum: '$hours' } } },
  ]);

  return {
    userId,
    taskStats: {
      total,
      byStatus: statusMap,
      completed: statusMap['done'],
      remaining: total - statusMap['done'],
    },
    totalHoursLogged: timeStats[0]?.totalHours ?? 0,
  };
};

export const ReportServices = { getProjectReport, getUserReportFromDB };