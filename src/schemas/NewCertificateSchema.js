import { z } from 'zod';

const TemplateSchema = z.object({
  type: z.string().default('text'), 
  text: z.string().optional(), 
  x: z.number().min(0), 
  y: z.number().min(0), 
  size: z.number().min(1), 
  status: z.enum(['static', 'dynamic']),
  visible: z.boolean().default(true), 
});

export const NewCertificateSchema = z.object({
  _id: z.string().optional(),
  template: z.any().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  course: z.string().min(1, "Course is required"),
  status: z.enum(["Active", "Revoked", "Expired"]).optional(),
  expiry: z.object({
    time: z.number().min(1, "Time is required"),
    timeUnit: z.string().min(1, "TimeUnit is required"),  
  }),
  layers: z.array(TemplateSchema),
  size: z.enum(["A4", "A5"]),
  rubrics: z.array(
    z.string({ required_error: "Rubric is required" }).min(1, {
      message: "Rubric is required",
    })
  ).min(1, "Rubrics is required"),
});

export default NewCertificateSchema;