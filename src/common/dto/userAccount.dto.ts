import { z } from 'zod';

export const userAccountSchema = z.object({
  firstName: z.string({
    required_error: 'First name is required',
  }),
  lastName: z.string({
    required_error: 'Last name is required',
  }),

  nickName: z.string({
    required_error: 'Nickname is required',
  }),
  password: z.string({
    required_error: 'Password is required',
  }),
});

export type UserAccountDto = z.infer<typeof userAccountSchema>;
