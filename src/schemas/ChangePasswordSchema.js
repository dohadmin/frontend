import { z } from 'zod';

const ChangePasswordSchema = z.object({
  _id: z.string().min(8, "Admin ID is required"),
  oldPassword: z.string({ required_error: "Old Password is required" }).min(8, "Password must be at least 8 characters"),
  newPassword: z.string({ required_error: "New Password is required" }).min(8, "New Password must be at least 8 characters"),
  confirmPassword: z.string({ required_error: "Confirm Password is required" }).min(8, "Confirm Password must be at least 8 characters"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // Specify the path to the field that should display the error
}).refine(data => data.oldPassword !== data.newPassword, {
  message: "New password must be different from the old password",
  path: ["newPassword"], // Specify the path to the field that should display the error
});

export default ChangePasswordSchema;