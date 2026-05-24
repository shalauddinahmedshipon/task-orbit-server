import { z } from 'zod';

const createTimeLogValidationSchema = z.object({
  body: z.object({
    hours: z.number().min(0.1, 'Minimum 0.1 hours'),
    logDate: z.coerce.date(),
    description: z.string().optional(),
  }),
});

const updateTimeLogValidationSchema = z.object({
  body: z.object({
    hours: z.number().min(0.1).optional(),
    logDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)))
      .optional(),
    description: z.string().optional(),
  }),
});

export const timeLogValidation = {
  createTimeLogValidationSchema,
  updateTimeLogValidationSchema,
};