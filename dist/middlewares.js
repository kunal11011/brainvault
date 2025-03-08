"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
exports.validateData = validateData;
const zod_1 = require("zod");
const constants_1 = require("./constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function validateData(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    message: `${issue.path.join(".")} is ${issue.message}`,
                }));
                res
                    .status(constants_1.STATUS_CODES.BAD_REQUEST.code)
                    .json({ error: "Invalid data", details: errorMessages });
            }
            else {
                const INTERNAL_SERVER_ERROR = constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR;
                error.statusCode = INTERNAL_SERVER_ERROR.code;
                error.message = INTERNAL_SERVER_ERROR.message;
                next(error);
            }
        }
    };
}
const userMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const SECRET_KEY = process.env.JWT_SECRET_KEY;
    const token = req.header("Authorization");
    try {
        if (!token) {
            throw new Error("User unauthorized.");
        }
        const payload = yield jsonwebtoken_1.default.verify(token, SECRET_KEY);
        if (payload && typeof payload === "object") {
            req.userId = payload.userId;
            next();
        }
        else {
            throw new Error("User unauthorized.");
        }
    }
    catch (error) {
        const FORBIDDEN = constants_1.STATUS_CODES.FORBIDDEN;
        error.statusCode = error.statusCode || FORBIDDEN.code;
        error.message = FORBIDDEN.message;
        next(error);
    }
});
exports.userMiddleware = userMiddleware;
