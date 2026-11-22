import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string().min(3).max(120),
  bodyMarkdown: z.string().min(20),
  researchQueries: z.array(z.string()).max(5),
  expectedResult: z.string().min(5),
});

export const PhaseSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  tasks: z.array(TaskSchema).min(1).max(7),
});

export const ProjectPlanSchema = z.object({
  projectName: z.string().min(3),
  description: z.string().min(10),
  userGoal: z.string().min(5),
  phases: z.array(PhaseSchema).min(1).max(8),
});

export type Task = z.infer<typeof TaskSchema>;
export type Phase = z.infer<typeof PhaseSchema>;
export type ProjectPlan = z.infer<typeof ProjectPlanSchema>;
