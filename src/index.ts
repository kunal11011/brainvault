import express from "express";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";

import { UserModel } from "./db";
import { validateData } from "./middlewares";
import { userValidation } from "./validations";
import { PORT, SALT_ROUNDS, STATUS_CODES } from "./constants";

const app = express();
app.use(bodyParser.json());

app.post("api/v1/signup", validateData(userValidation), async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    const user = await UserModel.create({
      username: req.body.username,
      password: hashedPass,
    });

    const CREATED = STATUS_CODES.CREATED;
    res
      .status(CREATED.code)
      .json({ message: CREATED.message, name: CREATED.name });
  } catch (error) {
    const BAD_REQUEST = STATUS_CODES.BAD_REQUEST;
    res.status(BAD_REQUEST.code).json({
      error: error,
    });
  }
});
app.post("api/v1/signin", validateData(userValidation), (req, res) => {});
app.post("api/v1/content", (req, res) => {});
app.get("api/v1/content", (req, res) => {});
app.post("api/v1/brain/share", (req, res) => {});
app.get("api/v1/brain/:shareLink", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
