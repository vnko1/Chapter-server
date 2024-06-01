import { z } from 'zod';

export const nickNameSchema = z.object({
  nickName: z.string({
    required_error: 'Nickname is required',
  }),
});

export type NickNameDto = z.infer<typeof nickNameSchema>;
