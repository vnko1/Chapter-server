import { z } from 'zod';

export const userEmailSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email(),
});

export type UserEmailDto = z.infer<typeof userEmailSchema>;
