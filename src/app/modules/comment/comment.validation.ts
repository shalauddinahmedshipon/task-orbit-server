import { z } from 'zod';

const createCommentValidationSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'Message is required'),
  }),
});

const updateCommentValidationSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'Message is required'),
  }),
});

export const commentValidation = {
  createCommentValidationSchema,
  updateCommentValidationSchema,
};