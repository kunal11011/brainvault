import { z } from "zod";
export const userValidation = z.object({
  username: z.string().email(),
  password: z.string().min(4, "Password too short!"),
});
