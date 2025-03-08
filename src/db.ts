import mongoose, { model, Model, Mongoose, Schema } from "mongoose";
import { MEMORY_TYPE } from "./constants";

const CONNECTION_STRING = process.env.MONGOURL!;
mongoose.connect(CONNECTION_STRING);

const UserSchema = new Schema({
  email: { type: String, unique: true },
  password: { type: String, minLength: 6 },
});

const TagSchema = new Schema({
  tag: { type: String, unique: true },
});

const MemorySchema = new Schema({
  type: { type: String, enum: MEMORY_TYPE, required: true },
  link: { type: String, required: true },
  title: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  userId: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export const TagModel = model("Tag", TagSchema);
export const MemoryModel = model("Memory", MemorySchema);
export const UserModel = model("User", UserSchema);
