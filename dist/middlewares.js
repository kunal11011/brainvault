"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = validateData;
const zod_1 = require("zod");
const constants_1 = require("./constants");
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
