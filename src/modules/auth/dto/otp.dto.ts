import { z } from 'zod';

export const otpSchema = z.object({
  otp: z.string({
    required_error: 'OTP is required',
  }),
});

export type OTPDto = z.infer<typeof otpSchema>;
