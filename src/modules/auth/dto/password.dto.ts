import { z } from 'zod';
import { REGEX } from 'src/utils';

export const passwordSchema = z.object({
  password: z
    .string({
      required_error: 'Password is required',
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
  otp: z.string({
    required_error: 'OTP is required',
  }),
});

export type PasswordDto = z.infer<typeof passwordSchema>;
