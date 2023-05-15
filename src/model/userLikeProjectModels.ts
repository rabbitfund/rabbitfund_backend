import mongoose from "mongoose";
const userLikeProjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    created: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
  }
);

userLikeProjectSchema.index({ user: 1, project: 1 }, { unique: true });

const UserLikeProject = mongoose.model(
  "UserLikeProject",
  userLikeProjectSchema
);

export default UserLikeProject;
