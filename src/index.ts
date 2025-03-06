import "dotenv/config";

import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import jwt, { Secret } from "jsonwebtoken";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";

import { UserModel } from "./db";
import { validateData } from "./middlewares";
import { userValidation } from "./validations";
import { STATUS_CODES } from "./constants";

// dotenv.config();
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS)!;
const PORT = process.env.PORT!;
const SECRET_KEY: Secret = process.env.JWT_SECRET_KEY!;
const app = express();
// app.use(bodyParser.json());
app.use(express.json());

app.post(
  "/api/v1/signup",
  validateData(userValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);

      const existingUser = await UserModel.findOne({ email: email });
      if (existingUser) {
        throw new Error("User Already Exists.");
      }

      const user = await UserModel.create({
        email: req.body.email,
        password: hashedPass,
      });

      const SUCCESS = STATUS_CODES.SUCCESS;
      res
        .status(SUCCESS.code)
        .json({ message: SUCCESS.message, name: SUCCESS.name, data: user });
    } catch (error: any) {
      if ((error.message = "User Already Exists.")) {
        const BAD_REQUEST = STATUS_CODES.BAD_REQUEST;
        error.statusCode = BAD_REQUEST.code;
      }
      const INTERNAL_SERVER_ERROR = STATUS_CODES.INTERNAL_SERVER_ERROR;
      error.statusCode = error.statusCode || INTERNAL_SERVER_ERROR.code;
      error.message = error.message || INTERNAL_SERVER_ERROR.message;
      next(error);
    }
  }
);

app.post(
  "/api/v1/signin",
  validateData(userValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const existingUser = await UserModel.findOne({ email });
      if (!existingUser) {
        throw new Error("Invalid Credentials.");
      }
      const comparePass = await bcrypt.compare(
        password,
        existingUser.password!
      );
      if (!comparePass) {
        throw new Error("Invalid Credentials.");
      }

      const SUCCESS = STATUS_CODES.SUCCESS;
      const token = jwt.sign(
        {
          id: existingUser._id,
        },
        SECRET_KEY
      );
      res.status(SUCCESS.code).json({
        token,
      });
    } catch (error: any) {
      if ((error.message = "Invalid Credentials.")) {
        const FORBIDDEN = STATUS_CODES.FORBIDDEN;
        error.statusCode = FORBIDDEN.code;
      }
      const INTERNAL_SERVER_ERROR = STATUS_CODES.INTERNAL_SERVER_ERROR;
      error.statusCode = error.statusCode || INTERNAL_SERVER_ERROR.code;
      error.message = error.message || INTERNAL_SERVER_ERROR.message;
      next(error);
    }
  }
);
app.post(
  "/api/v1/content",
  (req: Request, res: Response, next: NextFunction) => {}
);
app.get(
  "/api/v1/content",
  (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Hello World" });
  }
);
app.post(
  "/api/v1/brain/share",
  (req: Request, res: Response, next: NextFunction) => {}
);
app.get(
  "/api/v1/brain/:shareLink",
  (req: Request, res: Response, next: NextFunction) => {}
);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // console.trace(err);
  const SERVICE_UNAVAILABLE = STATUS_CODES.SERVICE_UNAVAILABLE;
  const errStatusCode = err.statusCode || SERVICE_UNAVAILABLE.code;
  const errMsg = err.message || SERVICE_UNAVAILABLE.message;
  res.status(errStatusCode).json({
    success: false,
    status: errStatusCode,
    message: errMsg,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
