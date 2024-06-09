import { z } from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from 'src/utils';

export const addBookSchema = z.object({
  bookName: z
    .string({ required_error: 'BookName is required' })
    .min(2, 'Must be at least 2 characters long.')
    .max(
      500,
      'The length of characters should not exceed 100 characters long.',
    ),
  author: z
    .string({ required_error: 'Author is required' })
    .min(2, 'Must be at least 2 characters long.')
    .max(
      500,
      'The length of characters should not exceed 500 characters long.',
    ),
  annotation: z
    .string({ required_error: 'Annotation is required' })
    .min(2, 'Must be at least 2 characters long.')
    .max(
      500,
      'The length of characters should not exceed 500 characters long.',
    ),
  bookStatus: z.enum(['read', 'reading', 'finished']).default('read'),
  image: z
    .any({ required_error: 'Book image is required' })
    .refine((image) => {
      return image !== undefined;
    }, `Image is required`)
    .refine((image) => {
      return image?.size <= MAX_FILE_SIZE;
    }, `Max image size is 3MB.`)
    .refine((image) => {
      return ACCEPTED_IMAGE_TYPES.includes(image?.mimetype);
    }, 'Only .jpg, .jpeg, .png and .webp formats are supported.'),
});

export const editBookSchema = z
  .object({
    bookName: z
      .string()
      .min(2, 'Must be at least 2 characters long.')
      .max(
        500,
        'The length of characters should not exceed 100 characters long.',
      )
      .optional(),
    author: z
      .string()
      .min(2, 'Must be at least 2 characters long.')
      .max(
        500,
        'The length of characters should not exceed 500 characters long.',
      )
      .optional(),
    annotation: z
      .string()
      .min(2, 'Must be at least 2 characters long.')
      .max(
        500,
        'The length of characters should not exceed 500 characters long.',
      )
      .optional(),
    bookStatus: z.enum(['read', 'reading', 'finished']).optional(),
    image: z
      .any()
      .refine((image) => {
        return image.size <= MAX_FILE_SIZE;
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
export type AddBookDto = z.infer<typeof addBookSchema>;
export type EditBookDto = z.infer<typeof editBookSchema>;
