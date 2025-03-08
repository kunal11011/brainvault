import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { STATUS_CODES } from "./constants";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { CustomRequest } from "./extendedtypes";

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

export const userMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const SECRET_KEY: Secret = process.env.JWT_SECRET_KEY!;
  const token = req.header("Authorization");
  try {
    if (!token) {
      throw new Error("User unauthorized.");
    }

    const payload = await jwt.verify(token, SECRET_KEY);
    if (payload && typeof payload === "object") {
      req.userId = payload.userId;
      next();
    } else {
      throw new Error("User unauthorized.");
    }
  } catch (error: any) {
    const FORBIDDEN = STATUS_CODES.FORBIDDEN;
    error.statusCode = error.statusCode || FORBIDDEN.code;
    error.message = FORBIDDEN.message;
    next(error);
  }
};
