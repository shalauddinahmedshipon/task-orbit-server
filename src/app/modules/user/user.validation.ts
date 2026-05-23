import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string(),

    email: z.string().email(),

    password: z.string().min(6),

    avatarUrl: z.string().optional(),

    department: z.string().optional(),

    skills: z.array(z.string()).optional(),

    status: z
      .enum(['in-progress', 'blocked'])
      .optional(),

    role: z
      .enum(['manager', 'member'])
      .optional(),
  }),
});

const updateUserProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    imageUrl: z.string().optional(),
  }),
});

const updateUserByAdminValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),


    department: z.string().optional(),

    skills: z.array(z.string()).optional(),

    role: z
      .enum(['admin', 'manager', 'member'])
      .optional(),

    status: z
      .enum(['in-progress', 'blocked'])
      .optional(),
  }),
});



export const userValidation = {
  createUserValidationSchema,
  updateUserProfileValidationSchema,
  updateUserByAdminValidationSchema,
};
