import { REGEX } from 'src/utils';
import { z } from 'zod';

export const updatePasswordSchema = z.object({
  password: z.string({
    required_error: 'Password is required',
  }),
  newPassword: z
    .string({
      required_error: 'New password is required',
    })
    .min(
      8,
      'Password must be at least 8 characters and no more 30 characters, including uppercase letters, one number and Latin letters only. Space symbol is not included.',
    )
    .max(
      30,
      'Password must be at least 8 characters and no more 30 characters, including uppercase letters, one number and Latin letters only. Space symbol is not included.',
    )
    .regex(
      REGEX.password,
      'Password must be at least 8 characters and no more 30 characters, including uppercase letters, one number and Latin letters only. Space symbol is not included.',
    ),
});

export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;
