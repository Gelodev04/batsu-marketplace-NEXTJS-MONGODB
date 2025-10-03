import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    image: { type: String },
    followers: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    following: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    campus: {
      type: String,
      enum: ["alangilan", "pablo-borbon"],
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
