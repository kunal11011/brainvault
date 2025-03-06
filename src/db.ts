import mongoose, { model, Model, Schema } from "mongoose";

const CONNECTION_STRING = process.env.MONGOURL!;
mongoose.connect(CONNECTION_STRING);

const UserSchema = new Schema({
  email: { type: String, unique: true },
  password: { type: String, minLength: 6 },
});

export const UserModel = model("User", UserSchema);
