"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memorySchema = exports.userSchema = void 0;
const zod_1 = require("zod");
// const memoryTypes = MEMORY_TYPE as const;
exports.userSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z
        .string()
        // .min(6, "Password too short!")
        .regex(/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/, "Password shold be 6 characters long and must contain one letter and one digit."),
});
// type: { type: String, enum: MEMORY_TYPE, required: true },
// link: { type: String, required: true },
// title: { type: String, required: true },
// tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
exports.memorySchema = zod_1.z.object({
    type: zod_1.z.enum(["document", "tweet", "youtube", "link"]),
    title: zod_1.z.string(),
    link: zod_1.z.string(),
    tags: zod_1.z.string().array(),
});
