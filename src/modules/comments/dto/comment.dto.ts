import { z } from 'zod';

export const commentSchema = z.object({
  text: z
    .string({
      required_error: 'Text is required',
    })
    .min(2)
    .max(1000),
});

export type CommentDto = z.infer<typeof commentSchema>;
