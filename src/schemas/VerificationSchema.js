import { z } from 'zod';

export const VerificationSchema = z.object({
  email: z.string({required_error: "Email is required"}).email("Invalid email address"),
  otp: z.string({required_error: "OTP is required"}).min(6, "OTP must be at least 6 characters"),
});

export default VerificationSchema