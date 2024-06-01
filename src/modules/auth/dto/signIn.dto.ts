import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string({
    required_error: 'Email is required',
  }),
  password: z.string({
    required_error: 'Password is required',
  }),
});

export type SignInDto = z.infer<typeof signInSchema>;
