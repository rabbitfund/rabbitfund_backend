import Project from "../model/projectModels";
import mongoose from 'mongoose';
import createError from "http-errors";

type ProjectCreateInput = {
  title: String;   // must
  summary: String;
  content: String;
  category: [String];   // must
  target: Number;   // must
  progress: Number;   // must
  // status: Number;
  start_date: Date;   // not required ?!
  end_date: Date;   // not required ?!
  // create_date: Date;
  // update_date: Date;
  // update_final_member: String;
  cover: String;   // must
  video: String;
  risks: String;
  owner: mongoose.Schema.Types.ObjectId;
  option: [mongoose.Schema.Types.ObjectId];
  news: [mongoose.Schema.Types.ObjectId];
  qas: [mongoose.Schema.Types.ObjectId];
  order: [mongoose.Schema.Types.ObjectId]
}

type ProjectUpdateInput = {
  title?: String;   // must
  summary?: String;
  content?: String;
  category?: [String];   // must
  target?: Number;   // must
  progress?: Number;   // must
  status?: Number;
  start_date?: Date;
  end_date?: Date;
  // create_date: Date;
  // update_date: Date;
  // update_final_member: String;
  cover?: String;   // must
  video?: String;
  risks?: String;
  owner?: mongoose.Schema.Types.ObjectId;
  option?: [mongoose.Schema.Types.ObjectId];
  news?: [mongoose.Schema.Types.ObjectId];
  qas?: [mongoose.Schema.Types.ObjectId];
  order?: [mongoose.Schema.Types.ObjectId]
}


async function doGetOwnerProjects(userId: string) {
  // TODO: 透過 user ID 找出 Project 們
  const projects = await Project.findById(userId).select({
    
  })
  return projects
}

async function doPostOwnerProject(userId: string, data: ProjectCreateInput) {
  const projects = await Project.create({
    project_title: data.title,
    project_summary: data.summary || "",
    project_content: data.content || "",
    project_category: data.category,
    project_target: data.target,
    project_progress: 0,
    project_status: 0,
    project_start_date: data.start_date || "",
    project_end_date: data.end_date || "",
    project_create_date: Date.now(),
    project_update_date: Date.now(),
    project_update_final_member: userId,
    project_cover: data.cover,
    project_video: data.video || "",
    project_risks: data.risks || "",
    ownerInfo: data.owner || "",
    option: data.option || [],
    news: data.news || [],
    qas: data.qas || [],
    order: data.order || []
  })
  return projects
}

async function doGetOwnerProject(projectId: string) {
  const project = await Project.findById(projectId)
  if (!!project) {
    return project;
  }
  throw createError(400, "找不到專案");
}

async function doPutOwnerProject(userId: string, prjectId: string, data: ProjectUpdateInput) {
  // will return previous version
  const project = await Project.findByIdAndUpdate(prjectId, {
    project_title: data.title,
    project_summary: data.summary,
    project_content: data.content,
    project_category: data.category,
    project_target: data.target,
    project_progress: data.progress,  // count by backend?
    project_status: data.status,
    project_start_date: data.start_date,
    project_end_date: data.end_date,
    // project_create_date: Date.now(),
    project_update_date: Date.now(),
    project_update_final_member: userId,
    project_cover: data.cover,
    project_video: data.video,
    project_risks: data.risks,
    ownerInfo: data.owner,
    option: data.option,
    news: data.news,
    qas: data.qas,
    order: data.order
  })

  if (!!project) {
    return project;
  }
  throw createError(400, "找不到專案");
}

async function doDeleteOwnerProject(projectId: string) {
  // 也可以用 findByIdAndDelete，回傳值比較長
  const result = await Project.deleteOne({_id: projectId})
  // { acknowledged: true, deletedCount: 1 }
  if (result.deletedCount === 1) {
    return result;
  }
  throw createError(400, "找不到專案");
}




async function doGetProject(projectId: string) {
  const project = await Project.findById(projectId)
  if (!!project) {
    // filtered out specific info 
    const {
      project_update_date: _,
      project_update_final_member: __,
      ...filteredProject
    } = project.toObject();

    return filteredProject;
  }

  throw createError(400, "找不到專案");
}


export {
  ProjectCreateInput,
  ProjectUpdateInput,
  doGetOwnerProjects,
  doPostOwnerProject,
  doGetOwnerProject,
  doPutOwnerProject,
  doDeleteOwnerProject,
  doGetProject,
}