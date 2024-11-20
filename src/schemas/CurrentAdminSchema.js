import { z } from 'zod';

export const CurrentAdminSchema = z.object({
  _id: z.string().min(1, "ID is required"),
  avatar: z.any().optional(),
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
  agency: z.string().min(1, "Agency is required"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  email: z.string().email("Invalid email address"),
});

export default CurrentAdminSchema;