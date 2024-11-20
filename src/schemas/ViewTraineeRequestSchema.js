import { z } from 'zod';

export const ViewTraineeRequestSchema = z.object({
  avatar: z.any().optional(),
  _id: z.string().min(1, "ID is required"),
  firstName: z.string().min(1, "First Name is required"),
  middleInitial: z.string().min(1,"Middle Initial is required").max(2, "Middle Initial should be at most 2 characters"),
  lastName: z.string().min(1, "Last Name is required"),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  civilStatus: z.enum(["Single", "Married", "Widowed", "Separated", "Divorced"]),
  gender: z.enum(["Male", "Female"]),
  street: z.string().min(1, "Street is required"),
  municipality: z.string().min(1, "Municipality is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  zipCode: z.string().regex(/^\d{4}$/, "Zip Code must be a 4-digit number"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  email: z.string().email("Invalid email address"),
  trainerId: z.string().min(1, "Trainer ID is required"),
});

export default ViewTraineeRequestSchema;