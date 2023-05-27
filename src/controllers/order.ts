import { NextFunction, Request, RequestHandler, Response } from "express";
import { handleSuccess, handleError } from "../service/handleReply";
import createError from "http-errors";
import { isValidObjectId } from "../utils/objectIdValidator";
import {
  OrderCreateInput,
  OrderDataInput,
  OrderCheckInput,
  verifyOrderCreateData,
  doOrderCreate,
  getOrderData,
  doOrderCheck,
  doGetMeOrders,
  doOrderReturn,
  doOrderNotify
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

export const checkOrder: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.orderid;
  console.log(req.params, orderId);

  if (!isValidObjectId(orderId)) {
    return next(createError(400, "找不到訂單"));
  }

  
  const order : any = await getOrderData(orderId);

  handleSuccess(res, order);
};

export const orderReturn: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('orderReturn:', req.body);
  
  const orderReturn = req.body;
  
  const order : any = await doOrderReturn(orderReturn);
  console.log('orderReturn redirect', order);

  // handleSuccess(res, order);
  // 將請求傳給前台
  res.redirect(order)

};

export const orderNotify: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('orderNotify:', req.body);
  
  const orderNotify = req.body;
  
  const order : any = await doOrderNotify(orderNotify);

  
  handleSuccess(res, order);
  // res.redirect(order)
};
