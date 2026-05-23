import { z } from 'zod';

const createSprintValidationSchema = z.object({
  body: z.object({
    projectId: z.string(),
    title: z.string().min(1, 'Title is required'),
    startDate: z.string().refine((d) => !isNaN(Date.parse(d)), {
      message: 'Invalid start date',
    }),
    endDate: z.string().refine((d) => !isNaN(Date.parse(d)), {
      message: 'Invalid end date',
    }),
    order: z.number().optional(),
  }),
});

const updateSprintValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    startDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)))
      .optional(),
    endDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)))
      .optional(),
    order: z.number().optional(),
  }),
});

export const sprintValidation = {
  createSprintValidationSchema,
  updateSprintValidationSchema,
};