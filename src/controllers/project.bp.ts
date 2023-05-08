import Project from "../model/projectModels";
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
  tag: [String];
  owner: String;
  option: [String];
  news: [String];
  qas: [String];
  order: [String];
  delete: Boolean;
  delete_member: String;
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
  tag?: [String];
  owner?: String;
  option?: [String];
  news?: [String];
  qas?: [String];
  order?: [String];
  // delete: Boolean;
  // delete_member: String;
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
    project_tag: data.tag || [],
    ownerInfo: data.owner || "",
    option: data.option || [],
    news: data.news || [],
    qas: data.qas || [],
    order: data.order || [],
    delete: false,
    delete_member: ""
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

async function doPutOwnerProject(userId: string, projectId: string, data: ProjectUpdateInput) {
  // will return previous version
  const project = await Project.findByIdAndUpdate(projectId, {
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
    project_tag: data.tag,
    ownerInfo: data.owner,
    option: data.option,
    news: data.news,
    qas: data.qas,
    order: data.order
  },
  { new: true })

  if (!!project) {
    return project;
  }
  throw createError(400, "找不到專案");
}

async function doDeleteOwnerProject(userId: string, projectId: string) {
  const project = await Project.findByIdAndUpdate(projectId, {
    delete: true,
    delete_member:userId
  },
  { new: true });

  if (project?.delete) {
    return project;
  };

  throw createError(400, "找不到專案");
}




async function doGetProject(projectId: string) {
  const project = await Project.findById(projectId)
  if (!!project) {
    // filtered out specific info 
    const {
      project_update_date: _,
      project_update_final_member: __,
      delete: ___,
      delete_member: ____,
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