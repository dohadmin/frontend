import { z } from 'zod';

const UpdateTrainingSchema = z.object({
  id: z.string({ required_error: "Training ID is required" }),
  trainerId: z.string({ required_error: "Trainer is required" }).min(1, "Trainer is required"),
  title: z.string({ required_error: "Title is required" }).min(3, "Title must be at least 3 characters"),
  description: z.string({ required_error: "Description is required" }).min(3, "Description must be at least 3 characters"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  trainees: z.array(
    z.object({
      id: z.string({ required_error: "Trainee ID is required" }),
      score: z.number ({ required_error: "Trainee score is required" }),
      status: z.string({ required_error: "Trainee status is required" }),
      rubrics: z.array(
        z.object({
          certificateId: z.string({ required_error: "Certificate ID is required" }),
          rubrics: z.array(
            z.string({ required_error: "Rubric is required" }).min(1, "Rubric is required")
          )
        })
      )
    })
  ),
  certificates: z.array(
    z.object({
      id: z.string({ required_error: "Certificate ID is required" }),
    })
  ).min(1, "Certificates is required"),
});

export default UpdateTrainingSchema;
