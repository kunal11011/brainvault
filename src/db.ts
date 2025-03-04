import { model, Model, Schema } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: { type: String, minLength: 4 },
});

export const UserModel = model("User", UserSchema);
