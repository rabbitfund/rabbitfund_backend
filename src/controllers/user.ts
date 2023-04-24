import { NextFunction, Request, RequestHandler, Response } from "express";
import { handleSuccess, handleError } from "../service/handleReply";
import createError from "http-errors";

import {
  UserSignUpInput,
  UserLogInInput,
  UserUpdateInput,
  doSignUp,
  doLogIn,
  doGetMeUser,
  doUpdateMeUser,
  verifyUserSignUpData,
  verifyUserLogInData,
  verifyUserUpdateData,
} from "./user.bp";

// 註冊
export const signUp: RequestHandler = async (
  req: Request<{}, {}, UserSignUpInput>,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;

  if (!verifyUserSignUpData(data)) {
    return next(createError(400, "欄位填寫不完整或格式錯誤"));
  }

  const user = await doSignUp(data);

  handleSuccess(res, user);
};

// 登入
export const login: RequestHandler = async (
  req: Request<{}, {}, UserLogInInput>,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;
  if (!verifyUserLogInData(data)) {
    return next(createError(400, "欄位填寫不完整或格式錯誤"));
  }

  if (data.forget) {
    return next(createError(400, "忘記密碼功能尚未開放"));
  }

  const ret = await doLogIn(data);

  return handleSuccess(res, ret);
};

//## get user own data
export const getMeUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;

  const user = await doGetMeUser(userId);
  return handleSuccess(res, user);
};

//## update user own data
export const updateMeUser: RequestHandler = async (
  req: Request<{}, {}, UserUpdateInput>,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;

  if (!verifyUserUpdateData(data)) {
    return next(createError(400, "欄位填寫不完整或格式錯誤"));
  }

  const userId = res.locals.user.id;

  const user = await doUpdateMeUser(userId, data);

  return handleSuccess(res, user);
};
