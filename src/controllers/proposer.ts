import { NextFunction, Request, RequestHandler, Response } from "express";
import { handleSuccess, handleError } from "../service/handleReply";
import createError from "http-errors";
import { isValidObjectId } from "../utils/objectIdValidator";
import { isEmptyStr } from "../utils/isEmpty";
import { UserRole } from "../model/userModels";
import {
    ProposerCreateInput,
    ProposerUpdateInput,
    doPostProposer,
    doGetProposer,
    doPutProposer,
    doDeleteProposer
} from "./proposer.bp";

//取得
export const getProposer: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = res.locals.user.id;
    const proposer = await doGetProposer(userId);
    // console.log(proposer);
  
    return handleSuccess(res, proposer || {});
  };

//新增
export const postProposer: RequestHandler = async (
    req: Request<{}, {}, ProposerCreateInput>,
    res: Response,
    next: NextFunction
  ) => {
    const userId = res.locals.user.id;
    const data = req.body;
    const proposer = await doPostProposer(userId, data);
    
    return handleSuccess(res, proposer);
  };

//修改
  export const putUserProposer: RequestHandler<{ id: string }> = async (
    req: Request<{ id: string }, {}, ProposerUpdateInput>,
    res: Response,
    next: NextFunction
  ) => {
    const userId = res.locals.user.id;
    const proposerId = req.params.id;
    const data = req.body;
    
    if (!isValidObjectId(proposerId)) {
      return handleError(res, createError(400, "提案人 ID 非有效 ObjectId"));
    }
      const proposer = await doPutProposer(userId, proposerId, data);
      return handleSuccess(res, proposer);
  };

//刪除
  export const deleteUserProposer: RequestHandler<{ id: string }> = async (
    req: Request<{ id: string }, {}, ProposerUpdateInput>,
    res: Response,
    next: NextFunction
  ) => {
    const userId = res.locals.user.id;
    const proposerId = req.params.id;
  
    if (!isValidObjectId(proposerId)) {
      return handleError(res, createError(400, "提案人 ID 非有效 ObjectId"));
    }
      const proposer = await doDeleteProposer(userId, proposerId);
      return handleSuccess(res, proposer);
  };