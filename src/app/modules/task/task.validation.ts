import { z } from 'zod';

const createTaskValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    sprintId: z.string().min(1, 'Sprint ID is required'),
    assignees: z.array(z.string()).optional(),
    estimatedHours: z.number().min(0).optional(),
    status: z.enum(['todo', 'in-progress', 'review', 'done']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    reviewApproval: z.boolean().optional(),
    dueDate: z.string().refine((d) => !isNaN(Date.parse(d)), {
      message: 'Invalid due date',
    }),
    subtasks: z
      .array(
        z.object({
          title: z.string().min(1),
          isComplete: z.boolean().optional(),
        }),
      )
      .optional(),
  }),
});

const updateTaskValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    sprintId: z.string().optional(),
    assignees: z.array(z.string()).optional(),
    estimatedHours: z.number().min(0).optional(),
    status: z.enum(['todo', 'in-progress', 'review', 'done']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    reviewApproval: z.boolean().optional(),
    dueDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)))
      .optional(),
    subtasks: z
      .array(
        z.object({
          _id: z.string().optional(),
          title: z.string().min(1),
          isComplete: z.boolean().optional(),
        }),
      )
      .optional(),
  }),
});

const updateTaskStatusValidationSchema = z.object({
  body: z.object({
    status: z
      .enum(['todo', 'in-progress', 'review', 'done'])
      .optional(),

    subtasks: z
      .array(
        z.object({
          _id: z.string(),
          isComplete: z.boolean(),
        }),
      )
      .optional(),
  }),
});

const approveTaskValidationSchema = z.object({
  body: z.object({
    approved: z.boolean(),
  }),
});






export const taskValidation = {
  createTaskValidationSchema,
  updateTaskValidationSchema,
  updateTaskStatusValidationSchema,
  approveTaskValidationSchema,
};