import { NextFunction, Request, RequestHandler, Response } from "express";
import { handleSuccess, handleError } from "../service/handleReply";
import createError from "http-errors";
import {
  OrderCreateInput,
  verifyOrderCreateData,
  doOrderCreate,
  doGetMeOrders
} from "./order.bp";

export const createOrder: RequestHandler = async (
  req: Request<{}, {}, OrderCreateInput>,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;

  if (!verifyOrderCreateData(data)) {
    return next(createError(400, "欄位填寫不完整或格式錯誤"));
  }

  const order = await doOrderCreate(data);

  handleSuccess(res, order);
};

export const getMeOrders: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const page = req.query.page as string

  const order = await doGetMeOrders(userId, page);

  handleSuccess(res, order);
};
