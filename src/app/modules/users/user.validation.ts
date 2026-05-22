import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email({ message: 'Invalid email format' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    needsPasswordChange: z.boolean().default(false).optional(),
    imageUrl: z.string().optional(),
    status: z
      .enum(['in-progress', 'blocked'])
      .optional()
      .default('in-progress'),
    role: z.enum(['superAdmin', 'admin']).optional().default('admin'),
  }),
});

const updateUserProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    imageUrl: z.string().optional(),
  }),
});
const updateUserStatusValidationScheme = z.object({
  body: z.object({
    status: z.enum(['in-progress', 'blocked']),
  }),
});
export const userValidation = {
  createUserValidationSchema,
  updateUserProfileValidationSchema,
  updateUserStatusValidationScheme,
};
