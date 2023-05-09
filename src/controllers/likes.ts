import { NextFunction, Request, RequestHandler, Response } from "express";
import { handleSuccess, handleError } from "../service/handleReply";
import createError from "http-errors";
import { isValidObjectId } from "../utils/objectIdValidator";
import { isEmptyStr } from "../utils/isEmpty";
import {
  CreateMeLikesInput,
  verifyCreateMeLikesData,
  doCreateMeLikes,
  doGetMeLikes,
  doDeleteMeLikes,
} from "./likes.bp";

export const createMeLikes: RequestHandler = async (
  req: Request<{}, {}, CreateMeLikesInput>,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const data = req.body;

  if (!verifyCreateMeLikesData(data)) {
    return next(createError(400, "欄位填寫不完整或格式錯誤"));
  }

  const user = await doCreateMeLikes(userId, data);

  handleSuccess(res, user);
};

// 登入
export const getMeLikes: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;

  const ret = await doGetMeLikes(userId);

  return handleSuccess(res, ret);
};

//## get user own data
export const deleteMeLikes: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const projectId = req.params.pid;
  if (isEmptyStr(projectId) || !isValidObjectId(projectId)) {
    return next(createError(400, "欄位填寫不完整或格式錯誤"));
  }

  const ok = await doDeleteMeLikes(userId, projectId);

  return handleSuccess(res, ok);
};
