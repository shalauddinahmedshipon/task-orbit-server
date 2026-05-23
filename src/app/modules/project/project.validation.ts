import { z } from 'zod';

const createProjectValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    thumbnail: z.string().optional(),
    client: z.string().min(1, 'Client is required'),
    description: z.string().min(1, 'Description is required'),
    startDate: z.string().refine((d) => !isNaN(Date.parse(d)), {
      message: 'Invalid start date',
    }),
    endDate: z.string().refine((d) => !isNaN(Date.parse(d)), {
      message: 'Invalid end date',
    }),
    budget: z.number().min(0, 'Budget must be non-negative'),
    status: z
      .enum(['planned', 'active', 'completed', 'archived'])
      .optional(),
    members: z.array(z.string()).optional(),
  }),
});

const updateProjectValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    thumbnail: z.string().optional(),
    client: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    startDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)))
      .optional(),
    endDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)))
      .optional(),
    budget: z.number().min(0).optional(),
    status: z
      .enum(['planned', 'active', 'completed', 'archived'])
      .optional(),
    members: z.array(z.string()).optional(),
  }),
});

export const projectValidation = {
  createProjectValidationSchema,
  updateProjectValidationSchema,
};