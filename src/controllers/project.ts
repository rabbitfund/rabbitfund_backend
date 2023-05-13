import { NextFunction, Request, RequestHandler, Response } from "express";
import { handleSuccess, handleError } from "../service/handleReply";
import createError from "http-errors";
import { isValidObjectId } from "../utils/objectIdValidator";

import {
  ProjectCreateInput,
  ProjectUpdateInput,
  doGetOwnerProjects,
  doPostOwnerProject,
  doGetOwnerProject,
  doPutOwnerProject,
  doDeleteOwnerProject,
  doGetProject,
} from "./project.bp";

import {
  doGetOwnerProjectOptions,
  doPostOwnerProjectOptions,
  doGetProjectOptions,
  doPatchProjectOptions
} from "./option.bp";

export const getOwnerProjects: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;

  const projects = await doGetOwnerProjects(userId);
  console.log(projects); // now project = null

  //todo: handle projects = null
  return handleSuccess(res, projects || {});
};

export const postOwnerProjects: RequestHandler = async (
  req: Request<{}, {}, ProjectCreateInput>,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const data = req.body;

  // TODO: verify data

  const project = await doPostOwnerProject(userId, data);
  return handleSuccess(res, project);
};

export const getOwnerProject: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const prjectId = req.params.pid;

  if (!isValidObjectId(prjectId)) {
    return next(createError(400, "找不到專案"));
  }

  const project = await doGetOwnerProject(prjectId);
  return handleSuccess(res, project);
};

export const putOwnerProject: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const prjectId = req.params.pid;
  const data = req.body;

  if (!isValidObjectId(prjectId)) {
    return next(createError(400, "找不到專案"));
  }

  // TODO: verify data

  const project = await doPutOwnerProject(userId, prjectId, data);
  return handleSuccess(res, project);
};

export const deleteOwnerProject: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const prjectId = req.params.pid;

  if (!isValidObjectId(prjectId)) {
    return next(createError(400, "找不到專案"));
  }

  const result = await doDeleteOwnerProject(userId, prjectId);
  return handleSuccess(res, result);
};

export const getOwnerProjectOptions: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const prjectId = req.params.pid;

  if (!isValidObjectId(prjectId)) {
    return next(createError(400, "找不到專案"));
  }

  const project = await doGetOwnerProjectOptions(prjectId);
  return handleSuccess(res, project);
};

export const postOwnerProjectOptions: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const prjectId = req.params.pid;
  const data = req.body;

  if (!isValidObjectId(prjectId)) {
    return next(createError(400, "找不到專案"));
  }

  // TODO: verify data

  const option = await doPostOwnerProjectOptions(prjectId, data);
  return handleSuccess(res, option);
};

export const patchProjectOptions: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const prjectId = req.params.pid;
  const optionId = req.params.optid;
  const data = req.body;
  
  if (!isValidObjectId(prjectId)) {
    return next(createError(400, "找不到專案"));
  }
  
  if (!isValidObjectId(optionId)) {
    return next(createError(400, "找不到方案"));
  }

  const option = await doPatchProjectOptions(prjectId, optionId, data);
  return handleSuccess(res, option);
};

export const getProject: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const userId = res.locals.user.id;
  const prjectId = req.params.pid;

  if (!isValidObjectId(prjectId)) {
    return next(createError(400, "找不到專案"));
  }

  const project = await doGetProject(prjectId);
  return handleSuccess(res, project);
};

export const getProjectOptions: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const userId = res.locals.user.id;
  const prjectId = req.params.pid;

  if (!isValidObjectId(prjectId)) {
    return next(createError(400, "找不到專案"));
  }

  const project = await doGetProjectOptions(prjectId);
  return handleSuccess(res, project);
};
