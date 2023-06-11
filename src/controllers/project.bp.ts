import Order from "../model/orderModels";
import Project from "../model/projectModels";
import UserProposer from "../model/userProposerModels";
import createError from "http-errors";
import "../model/newsModels";   // 不加這個沒辦法用 populate
import "../model/qasModels";

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
  const project = await Project.findById(projectId)
    .populate("ownerInfo")
    .populate("option")
    .populate("qas")
    .populate("news")
    .populate("order")
  
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

async function doUpdateOwnerProjectOrder(
  projectId: string,
  orderId: string
) {
  const project = await Project.updateOne(
    { _id: projectId },
    { $push: { order: orderId }}
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
  const pageNum = parseInt(page) || 1;
  const perPage = 9;
  const totalProjects = await Project.countDocuments(parameters).exec();
  const totalPages = Math.ceil(totalProjects / perPage);
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
      news: _____,
      qas: ______,
      order: _______, // 應該要改成數字就好，但前端會做另外處理(for Demo)，因此這邊直接移除
      ...filteredProject
    } = project.toObject();
    return filteredProject;
  });

  return [filteredProjects, totalPages, pageNum];
}

async function doGetProject(projectId: string) {
  const project = await Project.findById(projectId)
    .populate("ownerInfo", {
      _id: 1, //?
      proposer_name: 1,
      proposer_cover: 1,
      proposer_email: 1,
      proposer_project: 1,
      proposer_tax_id: 1
    })
    .populate("option", {
      _id: 1,
      option_name: 1,
      option_price: 1,
      option_content: 1,
      option_cover: 1
    })
    .populate("qas", {
      _id: 1,
      qas_q: 1,
      qas_a: 1,
      qas_update_date: 1
    })
    .populate("news", {
      _id: 1,
      news_title: 1,
      news_content: 1,
      news_cover: 1,
      news_update_date: 1
    })
  if (!!project) {
    if (!project.delete) {
      // filtered out specific info
      const {
        project_update_date: _,
        project_update_final_member: __,
        delete: ___,
        delete_member: ____,
        order: _______, // 應該要改成數字就好，但前端會做另外處理(for Demo)，因此這邊直接移除
        ...filteredProject
      } = project.toObject();

      return filteredProject;
    }
  }

  throw createError(400, "找不到專案");
}

//
async function doGetProjectSupporters(projectId: string) {
  const orders = await Order.find({
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

async function doUpdateTotalFundingAmount(projectId: string) {
  try {
    const project = await Project.findById(projectId);
    if (project) {
      const orders = await Order.find({ project: projectId });

      const totalFundingAmount = orders.reduce((total, order) => {
        if (order.order_total) {
          return total + order.order_total;
        }
        return total;
      }, 0);
      console.log('doUpdateTotalFundingAmount totalFundingAmount', totalFundingAmount);
      console.log('doUpdateTotalFundingAmount project', project._id);
      console.log('doUpdateTotalFundingAmount project_progress', project.project_progress);
      
      project.project_progress = totalFundingAmount;
      await project.save();
    }
  } catch (error) {
    console.log("更新募資總金額失敗", error);
  }
}

async function doGetTotalFundingAmount(projectId: string) {
  try {
    const project = await Project.findById(projectId, 'project_title project_progress project_target');
    if (project) {
      const project_id = project._id || '';
      const project_title = project.project_title || '';
      const project_progress = project.project_progress || 0;
      const project_target = project.project_target || 0; 
      const progressPercentage = Math.round((project_progress / project_target) * 100);
      return {
        project_id,
        project_title,
        project_progress,
        project_target,
        progress_percentage: progressPercentage,
      };
    }
    console.error("找不到專案");
  } catch (error) {
    console.error("取得募資總金額失敗", error);
  }
  return {
    project_id: '',
    project_progress: 0,
    project_title: '',
    progress_percentage: 0,
  };
}

export {
  ProjectCreateInput,
  ProjectUpdateInput,
  doGetOwnerProjects,
  doPostOwnerProject,
  doGetOwnerProject,
  doPutOwnerProject,
  doUpdateOwnerProjectOption,
  doUpdateOwnerProjectOrder,
  doDeleteOwnerProject,
  doGetProjects,
  doGetProject,
  doGetProjectSupporters,
  doUpdateTotalFundingAmount,
  doGetTotalFundingAmount
};
