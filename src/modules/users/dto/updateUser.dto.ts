import { z } from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from 'src/utils';

export const updateUserSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'he length of characters should not exceed 2 characters long.')
      .max(40, 'First name must be at least 40 characters long.')
      .optional(),
    lastName: z
      .string()
      .min(2, 'Must be at least 2 characters long.')
      .max(40, 'he length of characters should not exceed 40 characters long.')
      .optional(),
    status: z
      .string()
      .min(2, 'Must be at least 2 characters long.')
      .max(
        120,
        'The length of characters should not exceed 120 characters long.',
      )
      .optional(),
    location: z.string().min(2).optional(),
    image: z
      .any()
      .refine((file) => {
        return file?.size <= MAX_FILE_SIZE;
      }, `Max image size is 3MB.`)
      .refine((image) => {
        return ACCEPTED_IMAGE_TYPES.includes(image?.mimetype);
      }, 'Only .jpg, .jpeg, .png and .webp formats are supported.')
      .optional(),
  })
  .refine(
    (data) => {
      return Object.keys(data).some((key) => data[key] !== undefined);
    },
    {
      message: 'At least one field must be provided.',
      path: [],
    },
  );

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
