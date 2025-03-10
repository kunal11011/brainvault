import { z } from "zod";
import { MEMORY_TYPE } from "./constants";

// const memoryTypes = MEMORY_TYPE as const;

export const userSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    // .min(6, "Password too short!")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/,
      "Password shold be 6 characters long and must contain one letter and one digit."
    ),
});

// type: { type: String, enum: MEMORY_TYPE, required: true },
// link: { type: String, required: true },
// title: { type: String, required: true },
// tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],

export const memorySchema = z.object({
  type: z.enum(["document", "tweet", "youtube", "link"]),
  title: z.string(),
  link: z.string(),
  tags: z.string().array(),
});

export const tagSchema = z.object({
  tagName: z.string(),
});
