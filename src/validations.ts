import { z } from "zod";
export const userValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    // .min(6, "Password too short!")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/,
      "Password shold be 6 characters long and must contain one letter and one digit."
    ),
});
