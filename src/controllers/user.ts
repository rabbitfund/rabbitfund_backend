import { Request, RequestHandler, Response } from "express";
import { handleSuccess, handleError } from "../service/handleReply";
import { User, UserRole } from "../model/userModels";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import {
  UserSignUpInput,
  UserSignInInput,
  UserUpdateInput,
  doSignUp,
  doSignIn,
  doGetMeUser,
  doUpdateMeUser,
  verifyUserSignUpData,
  verifyUserSignInData,
  verifyUserUpdateData,
} from "./user.bp";

// 註冊
export const signUp: RequestHandler = async (
  req: Request<{}, {}, UserSignUpInput>,
  res: Response
) => {
  const data = req.body;

  if (!verifyUserSignUpData(data)) {
    return handleError(res, new Error("欄位填寫不完整或格式錯誤"));
  }

  try {
    const user = await doSignUp(data);

    handleSuccess(res, user);
  } catch (err: any) {
    handleError(res, err);
  }
};

// 登入
export const signIn: RequestHandler = async (
  req: Request<{}, {}, UserSignInInput>,
  res: Response
) => {
  const data = req.body;
  if (!verifyUserSignInData(data)) {
    return handleError(res, new Error("欄位填寫不完整或格式錯誤"));
  }
  if (data.forget) {
    return handleError(res, new Error("忘記密碼功能尚未開放"));
  }

  try {
    const ret = await doSignIn(data);

    return handleSuccess(res, ret);
  } catch (err: any) {
    handleError(res, err);
  }
};

//## get user own data
export const getMeUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const userId = res.locals.user.id;

  try {
    const user = await doGetMeUser(userId);
    return handleSuccess(res, user);
  } catch (err: any) {
    handleError(res, err);
  }
};
//## update user own data

export const updateMeUser: RequestHandler = async (
  req: Request<{}, {}, UserUpdateInput>,
  res: Response
) => {
  const data = req.body;
  if (!verifyUserUpdateData(data)) {
    return handleError(res, new Error("欄位填寫不完整或格式錯誤"));
  }

  const userId = res.locals.user.id;
  try {
    const user = await doUpdateMeUser(userId, data);

    return handleSuccess(res, user);
  } catch (err: any) {
    handleError(res, err);
  }
};
