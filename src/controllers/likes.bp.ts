import { isValidObjectId } from "../utils/objectIdValidator";
import { isEmptyStr } from "../utils/isEmpty";
import UserLikeProject from "../model/userLikeProjectModels";

type CreateMeLikesInput = {
  pid: string; //must
};

const verifyCreateMeLikesData = (data: CreateMeLikesInput): boolean => {
  return !isEmptyStr(data.pid) && isValidObjectId(data.pid);
};

async function doCreateMeLikes(userId: string, data: CreateMeLikesInput) {
  await UserLikeProject.create({
    user: userId,
    project: data.pid,
  });
  const likes = await UserLikeProject.find({ user: userId }).populate(
    "project",
    ["project_title", "project_summary"]
  );

  return likes;
}

async function doGetMeLikes(userId: string) {
  const likes = await UserLikeProject.find({ user: userId }).populate(
    "project",
    ["project_title", "project_summary"]
  );

  return likes;
}

async function doDeleteMeLikes(userId: string, projectId: string) {
  await UserLikeProject.deleteOne({ user: userId, project: projectId });

  return true;
}

export {
  CreateMeLikesInput,
  verifyCreateMeLikesData,
  doCreateMeLikes,
  doGetMeLikes,
  doDeleteMeLikes,
};
