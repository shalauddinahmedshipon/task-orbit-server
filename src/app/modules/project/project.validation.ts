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

    budget: z.coerce.number().min(0, 'Budget must be non-negative'),

    status: z.enum(['planned', 'active', 'completed', 'archived']).optional(),

    members: z.preprocess((val) => {
      // if form-data sends array with single JSON string
      if (
        Array.isArray(val) &&
        val.length === 1 &&
        typeof val[0] === 'string'
      ) {
        return JSON.parse(val[0]);
      }

      // if direct JSON string
      if (typeof val === 'string') {
        return JSON.parse(val);
      }

      return val;
    }, z.array(z.string()).optional()),
  }),
});

const addMembersValidationSchema = z.object({
  body: z.object({
    memberIds: z.array(z.string()).min(1, 'At least one member is required'),
  }),
});

const updateProjectValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),

    thumbnail: z.string().optional(),

    client: z.string().min(1, 'Client is required').optional(),

    description: z.string().min(1, 'Description is required').optional(),

    startDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), {
        message: 'Invalid start date',
      })
      .optional(),

    endDate: z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), {
        message: 'Invalid end date',
      })
      .optional(),

    budget: z.coerce.number().min(0, 'Budget must be non-negative').optional(),

    status: z.enum(['planned', 'active', 'completed', 'archived']).optional(),

    members: z
      .preprocess((val) => {
        // if form-data sends array with single JSON string
        if (
          Array.isArray(val) &&
          val.length === 1 &&
          typeof val[0] === 'string'
        ) {
          return JSON.parse(val[0]);
        }

        // if direct JSON string
        if (typeof val === 'string') {
          return JSON.parse(val);
        }

        return val;
      }, z.array(z.string()).optional())
      .optional(),
  }),
});

export const projectValidation = {
  createProjectValidationSchema,
  updateProjectValidationSchema,
  addMembersValidationSchema,
};
