import { NextFunction, Request, RequestHandler, Response } from "express";
import { handleSuccess, handleError } from "../service/handleReply";
import createError from "http-errors";
import { isValidObjectId } from "../utils/objectIdValidator";
import { isEmptyStr } from "../utils/isEmpty";
import { UserRole } from "../model/userModels";
import {
  ProjectCreateInput,
  ProjectUpdateInput,
  doGetOwnerProjects,
  doPostOwnerProject,
  doGetOwnerProject,
  doPutOwnerProject,
  doUpdateOwnerProjectOption,
  doDeleteOwnerProject,
  doGetProjects,
  doGetProject,
  doGetProjectSupporters,
  doUpdateTotalFundingAmount,
  doGetTotalFundingAmount
} from "./project.bp";

import {
  doGetOwnerProjectOptions,
  doPostOwnerProjectOptions,
  doGetProjectOptions,
  doGetProjectOption,
  doPatchProjectOptions,
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
  const projectId = req.params.pid;

  if (!isValidObjectId(projectId)) {
    return next(createError(400, "找不到專案"));
  }

  // TODO: 必須是提案人才可以看
  // 確認 UserProposer proposer_create = userId, proposer_project 包含 projectId

  // 在 proposer.bp.ts 弄一個 function
  // const proposers = await UserProposer.find({
  //   proposer_create: userId,
  //   proposer_project 包含 projectId
  // }).exec();
  // 如果 proposers 不存在，return next(createError(400, "非專案發起人"));

  const project = await doGetOwnerProject(projectId);
  return handleSuccess(res, project);
};

export const putOwnerProject: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const projectId = req.params.pid;
  const data = req.body;

  console.log("putOwnerProject=", projectId);

  if (!isValidObjectId(projectId)) {
    return next(createError(400, "找不到專案"));
  }

  // TODO: verify data

  const project = await doPutOwnerProject(userId, projectId, data);
  return handleSuccess(res, project);
};

export const deleteOwnerProject: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const projectId = req.params.pid;

  if (!isValidObjectId(projectId)) {
    return next(createError(400, "找不到專案"));
  }

  const result = await doDeleteOwnerProject(userId, projectId);
  return handleSuccess(res, result);
};

export const getOwnerProjectOptions: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const projectId = req.params.pid;

  if (!isValidObjectId(projectId)) {
    return next(createError(400, "找不到專案"));
  }

  const project = await doGetOwnerProjectOptions(projectId);
  return handleSuccess(res, project);
};

export const postOwnerProjectOptions: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const projectId = req.params.pid;
  const data = req.body;

  if (!isValidObjectId(projectId)) {
    return next(createError(400, "找不到專案"));
  }

  // TODO: verify data

  const option = await doPostOwnerProjectOptions(projectId, data);
  const project = await doUpdateOwnerProjectOption(projectId, option._id.toString());

  return handleSuccess(res, option);
};

export const getProjects: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const userId = res.locals.user.id;
  const type = req.query.type as string;
  const keyword = req.query.k as string;
  const page = req.query.page as string;
  const tag = req.query.tag as string;

  interface Parameters {
    project_title?: Object,
    project_tag?: string,
    project_category?: string,
    project_status: number | Object
  }
  let parameters: Parameters = {
    project_status: { $gte: 2 }
  };
  if (!!keyword) {
    parameters.project_title = { $regex: keyword}
  };
  if (!!tag) {
    parameters.project_tag = tag 
  };
  if (!!type) {
    parameters.project_category = type
  };

  const [projects, totalPages, currentPage] = await doGetProjects(parameters, page);
  const result = {
    totalPages: totalPages,
    currentPage: currentPage,
    projects: projects
  }

  return handleSuccess(res, result || {});
};

export const patchProjectOptions: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const projectId = req.params.pid;
  const optionId = req.params.optid;
  const data = req.body;

  if (!isValidObjectId(projectId)) {
    return next(createError(400, "找不到專案"));
  }

  if (!isValidObjectId(optionId)) {
    return next(createError(400, "找不到方案"));
  }

  const option = await doPatchProjectOptions(projectId, optionId, data);
  return handleSuccess(res, option);
};

export const getProject: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const userId = res.locals.user.id;
  const projectId = req.params.pid;

  if (!isValidObjectId(projectId)) {
    return next(createError(400, "找不到專案"));
  }

  const project = await doGetProject(projectId);
  return handleSuccess(res, project);
};

export const getProjectOptions: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const userId = res.locals.user.id;
  const projectId = req.params.pid;

  if (!isValidObjectId(projectId)) {
    return next(createError(400, "找不到專案"));
  }

  const project = await doGetProjectOptions(projectId);
  return handleSuccess(res, project);
};

export const getProjectOption: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const projectId = req.params.pid;
  const optionId = req.params.optid;

  if (!isValidObjectId(projectId)) {
    return next(createError(400, "找不到專案"));
  }
  if (!isValidObjectId(optionId)) {
    return next(createError(400, "找不到方案"));
  }

  const option = await doGetProjectOption(optionId);
  return handleSuccess(res, option);
};

// B10: 取得專案贊助人列表
export const getProjectSupporters: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const userId = res.locals.user.id;

  // check user's role
  if (!res.locals.user.roles.includes(UserRole.PROVIDER)) {
    return next(createError(403, "非專案發起人"));
  }

  const projectId = req.params.pid;
  if (isEmptyStr(projectId) || !isValidObjectId(projectId)) {
    return next(createError(400, "欄位填寫不完整或格式錯誤"));
  }

  const supporters = await doGetProjectSupporters(projectId);

  handleSuccess(res, supporters);
};

export const updateTotalFundingAmount: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const projectId = req.params.pid;

  if (!isValidObjectId(projectId)) {
    return next(createError(400, "找不到專案"));
  }
  try {
    await doUpdateTotalFundingAmount(projectId);
    return handleSuccess(res, { message: "更新募資總金額成功" });
  } catch (error) {
    return next(createError(400, "更新募資總金額失敗"));
  }
};

export const getTotalFundingAmount: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const projectId = req.params.pid;

  if (!isValidObjectId(projectId)) {
    return next(createError(400, "找不到專案"));
  }
  try {
    const totalFundingAmount = await doGetTotalFundingAmount(projectId);
    return handleSuccess(res, { totalFundingAmount });
  } catch (error) {
    return next(createError(400, "取得募資總金額失敗"));
  }
};