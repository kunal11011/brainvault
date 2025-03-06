"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
exports.userValidation = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z
        .string()
        // .min(6, "Password too short!")
        .regex(/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/, "Password shold be 6 characters long and must contain one letter and one digit."),
});
