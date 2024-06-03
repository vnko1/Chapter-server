import { REGEX } from 'src/utils';
import { z } from 'zod';

export const userAccountSchema = z.object({
  cookieAccepted: z.boolean({
    required_error: 'Cookie accepted field is required',
  }),
  firstName: z
    .string({
      required_error: 'First name is required',
    })
    .min(2, 'First name must be at least 5 characters long.')
    .max(40, 'First name must be at least 40 characters long.'),
  lastName: z
    .string({
      required_error: 'Last name is required',
    })
    .min(2, 'Last name must be at least 5 characters long.')
    .max(40, 'Last name must be at least 40 characters long.'),

  nickName: z
    .string({
      required_error: 'Nickname is required',
    })
    .min(3, 'Nickname must be at least 3 characters long.')
    .max(30, 'Nickname must be at least 30 characters long.')
    .regex(REGEX.nickName, 'Invalid nickname pattern'),

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
});

export type UserAccountDto = z.infer<typeof userAccountSchema>;
