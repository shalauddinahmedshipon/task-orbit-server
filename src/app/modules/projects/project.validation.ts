import { z } from 'zod';

const createImageSchema = z.object({
  url: z.string({ required_error: 'Image URL is required!' }),
  tag: z.string().min(1, { message: 'Tag is required' }),
});

const updateImageSchema = z.object({
  imageId: z.string({ required_error: 'Image ID is required!' }),
  url: z.string().optional(),
  tag: z.string().optional(),
});

const createProjectValidationSchema = z.object({
  body: z.object({
    projectName: z.string({ required_error: 'Project name is required' }),
    mainCategory: z.string({ required_error: 'Main Category ID is required' }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid Main Category ID'),
    category: z.string({ required_error: ' Category ID is required' }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid Category ID'),
    projectLocation: z.string({
      required_error: 'Project location is required',
    }),
    clientName: z.string({ required_error: 'Client name is required' }),
    year: z
      .number({ required_error: 'Year is required' })
      .int()
      .min(1900, 'Year must be 1900 or later')
      .max(new Date().getFullYear(), 'Year cannot be in the future'),
    siteArea: z.string({ required_error: 'Site area is required' }),
    projectDetails: z.string({
      required_error: 'Project details are required',
    }),
    projectImages: z.array(createImageSchema).optional(),
  }),
});

const updateProjectValidationSchema = z.object({
  body: z.object({
    updatedFields: z
      .object({
        projectName: z.string().optional(),
        category: z.string().optional(),
        projectLocation: z.string().optional(),
        clientName: z.string().optional(),
        year: z
          .number()
          .int()
          .min(1900)
          .max(new Date().getFullYear())
          .optional(),
        siteArea: z.string().optional(),
        projectDetails: z.string().optional(),
      })
      .optional(),
    newImages: z.array(createImageSchema).optional(),
    updateImages: z.array(updateImageSchema).optional(),
    deleteImageIds: z.array(z.string()).optional(),
  }),
});

export const projectValidation = {
  createProjectValidationSchema,
  updateProjectValidationSchema,
};
