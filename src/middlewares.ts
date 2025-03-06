import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { STATUS_CODES } from "./constants";

export function validateData(schema: z.ZodObject<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(STATUS_CODES.BAD_REQUEST.code)
          .json({ error: "Invalid data", details: errorMessages });
      } else {
        const INTERNAL_SERVER_ERROR = STATUS_CODES.INTERNAL_SERVER_ERROR;
        error.statusCode = INTERNAL_SERVER_ERROR.code;
        error.message = INTERNAL_SERVER_ERROR.message;
        next(error);
      }
    }
  };
}
