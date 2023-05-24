import Order from "../model/orderModels";
import Project from "../model/projectModels";
import UserProposer from "../model/userProposerModels";
import createError from "http-errors";

type ProjectCreateInput = {
  title: String; // must
  summary: String;
  content: String;
  category: String; // must
  target: Number; // must
  progress: Number; // must
  // status: Number;
  start_date: Date; // not required ?!
  end_date: Date; // not required ?!
  // create_date: Date;
  // update_date: Date;
  // update_final_member: String;
  cover: String; // must
  video: String;
  risks: String;
  tag: String;
  owner: String;
  option: [String];
  news: [String];
  qas: [String];
  order: [String];
  delete: Boolean;
  delete_member: String;
};

type ProjectUpdateInput = {
  title?: String; // must
  summary?: String;
  content?: String;
  category?: String; // must
  target?: Number; // must
  progress?: Number; // must
  status?: Number;
  start_date?: Date;
  end_date?: Date;
  // create_date: Date;
  // update_date: Date;
  // update_final_member: String;
  cover?: String; // must
  video?: String;
  risks?: String;
  tag?: String;
  owner?: String;
  option?: [String];
  news?: [String];
  qas?: [String];
  order?: [String];
  // delete: Boolean;
  // delete_member: String;
};

async function doGetOwnerProjects(userId: string) {
  const proposers = await UserProposer.find({
    proposer_create: userId,
    // 先不處理 proposer_group
  }).exec();
  console.log("userId", userId);

  const totalProjects = [];
  for (let proposer of proposers) {
    const projects = await Project.find({
      ownerInfo: proposer,
    }).exec();

    totalProjects.push(...projects);
  }

  return totalProjects;
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
    project_tag: data.tag,
    ownerInfo: data.owner || null,
    option: data.option || [],
    news: data.news || [],
    qas: data.qas || [],
    order: data.order || [],
    delete: false,
    delete_member: null,
  });
  return projects;
}

async function doGetOwnerProject(projectId: string) {
  const project = await Project.findById(projectId);
  if (!!project) {
    if (!project.delete) return project;
  }
  throw createError(400, "找不到專案");
}

async function doPutOwnerProject(
  userId: string,
  projectId: string,
  data: ProjectUpdateInput
) {
  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      project_title: data.title,
      project_summary: data.summary,
      project_content: data.content,
      project_category: data.category,
      project_target: data.target,
      project_progress: data.progress, // count by backend?
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
      order: data.order,
    },
    { new: true }
  );

  if (!!project) {
    return project;
  }
  throw createError(400, "找不到專案");
}

async function doUpdateOwnerProjectOption(
  projectId: string,
  optionId: string
) {
  const project = await Project.updateOne(
    { _id: projectId },
    { $push: { option: optionId }}
  );

  if (!!project) {
    return project;
  }
  throw createError(400, "找不到專案");
}

async function doDeleteOwnerProject(userId: string, projectId: string) {
  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      delete: true,
      delete_member: userId,
    },
    { new: true }
  );

  if (project?.delete) {
    return project;
  }

  throw createError(400, "找不到專案");
}

async function doGetProjects(parameters: any, page: string) {
  const pageNum = parseInt(page);
  const perPage = 10;
  const projects = await Project.find(parameters)
    .populate("ownerInfo", {
      _id: 1,
      proposer_name: 1,
      proposer_cover: 1,
      proposer_tax_id: 1
    })
    .populate("option", {
      _id: 1,
      option_name: 1,
      option_price: 1,
      option_content: 1,
      option_cover: 1
    })
    .limit(perPage)
    .skip(perPage * (pageNum - 1));

  // if (!projects || projects.length === 0) {
  //   throw createError(400, "找不到專案");
  // }

  // filtered out specific info
  const filteredProjects = projects.map((project) => {
    const {
      project_update_date: _,
      project_update_final_member: __,
      delete: ___,
      delete_member: ____,
      ...filteredProject
    } = project.toObject();
    return filteredProject;
  });

  return filteredProjects;
}

async function doGetProject(projectId: string) {
  const project = await Project.findById(projectId)
    .populate("ownerInfo", {
      _id: 1, //?
      proposer_name: 1,
      proposer_cover: 1,
      proposer_tax_id: 1
    })
    .populate("option", {
      _id: 1,
      option_name: 1,
      option_price: 1,
      option_content: 1,
      option_cover: 1
    })
  if (!!project) {
    if (!project.delete) {
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
  }

  throw createError(400, "找不到專案");
}

//
async function doGetProjectSupporters(userId: string, projectId: string) {
  const orders = await Order.find({
    user: userId,
    project: projectId,
    order_status: 2,
  })
    .populate("user", { _id: 1, user_name: 1, user_email: 1 })
    .populate("option", {
      _id: 1,
      option_name: 1,
      option_price: 1,
      option_content: 1,
    })
    .populate("order_info", {
      _id: 1,
      payment_price: 1,
      payment_method: 1,
      payment_status: 1,
    });

  return orders || [];
}

export {
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
};
