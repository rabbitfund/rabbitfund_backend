import { Request, Response, NextFunction } from "express";

export function handleErrorAsync(innerFunc: any) {
  // func 先將 async fun 帶入參數儲存
  // middleware 先接住 router 資料
  return async function (req: Request, res: Response, next: NextFunction) {
    //再執行函式，async 可再用 catch 統一捕捉
    innerFunc(req, res, next).catch((err: any) => {
      next(err);
    });
  };
}
