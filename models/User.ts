import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  role: {
    type: String,
    enum: ["student", " admin"],
    default: "student",
  },
});

const User = models.User || model("User", UserSchema);
export default User;
