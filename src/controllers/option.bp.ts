import Project from "../model/projectModels";
import Option from "../model/optionModels";
import createError from "http-errors";


type OptionCreateInput = {
  // parent: mongoose.Schema.Types.ObjectId;
  name: String;   // must
  price: Number;   // must
  total: Number;   // must
  content: String;
  cover: String;
  // status: Number;
  start_date: Date;
  end_date: Date;
  // create_date: Date;
  // update_date: Date;
  delete: Boolean;
  delete_member: String;
}
type OptionUpdateInput = {
  // parent: String;   // must
  name?: String;
  price?: Number;
  total?: Number;
  content?: String;
  cover?: String;
  status?: Number;
  start_date?: Date;
  end_date?: Date;
  // create_date: Date;
  update_date?: Date;
  // delete?: Boolean;
  // delete_member?: String;
}


async function doGetOwnerProjectOptions(projectId: string) {
  const project = await Project.findById(projectId)
  if (!project || project.delete) {
    throw createError(400, "找不到專案");
  }
  
  const option = await Option.find({
    option_parent: projectId,
    delete: false
  }).exec();
  
  if (!option || option.length === 0) {
    throw createError(400, "找不到方案");
  }
  return option
}

async function doPostOwnerProjectOptions(projectId: string, data: OptionCreateInput) {
  const project = await Project.findById(projectId)
  if (!project || project.delete) {
    throw createError(400, "找不到專案");
  }

  const option = await Option.create({
    option_parent: projectId,
    option_name: data.name,
    option_price: data.price,
    option_total: data.total,
    option_content: data.content || "",
    option_cover: data.cover || "",
    option_status: 0,
    option_start_date: data.start_date || "",
    option_end_date: data.end_date || "",
    option_create_date: Date.now(),
    option_update_date: Date.now(),
    delete: false,
    delete_member: null,
  })

  return option;
}

async function doGetProjectOptions(projectId: string) {
  const project = await Project.findById(projectId)
  if (!project || project.delete) {
    throw createError(400, "找不到專案");
  }

  const options = await Option.find({
    option_parent: projectId,
    delete: false
  }).exec();
  
  if (!options || options.length === 0) {
    throw createError(400, "找不到方案");
  }

  // filtered out specific info 
  const filteredOptions = options.map(option => {
    const {
      option_create_date: _,
      option_update_date: __,
      delete: ___,
      delete_member: ____,
      ...filteredOption
    } = option.toObject();
    return filteredOption
  })

  return filteredOptions
}

async function doGetProjectOption(optionId: string) {
  const option = await Option.findById(optionId)
    .populate("option_parent", {
      _id: 1,
      project_title: 1,
      project_end_date: 1,
    })
  if (!option || option.delete) {
    throw createError(400, "找不到方案");
  }

  // filtered out specific info
  const {
    option_create_date: _,
    option_update_date: __,
    delete: ___,
    delete_member: ____,
    ...filteredOption
  } = option.toObject();

  // TODO: add project title

  return filteredOption;
}

async function doPatchProjectOptions(projectId: string, optionId: string, data: OptionUpdateInput) {
  const project = await Project.findById(projectId)
  if (!project || project.delete) {
    throw createError(400, "找不到專案");
  }

  const options = await Option.find({
    option_parent: projectId,
    delete: false
  }).exec();
  
  if (!options || options.length === 0) {
    throw createError(400, "找不到方案");
  }

  // const option = {
  //   option_name: data.name,
  //   option_price: data.price,
  //   option_total: data.total,
  //   option_content: data.content,
  //   option_cover: data.cover,
  //   option_status: data.status,
  //   option_start_date: data.start_date,
  //   option_end_date: data.end_date,
  //   // option_create_date: '',
  //   option_update_date: Date.now(),
  //   // option_update_date: data.update_date,
  //   // delete: data.delete,
  //   // delete_member: data.delete_member,
  // }

  const updateOption = await Option.findByIdAndUpdate( optionId, {
    option_name: data.name,
    option_price: data.price,
    option_total: data.total,
    option_content: data.content,
    option_cover: data.cover,
    option_status: data.status,
    option_start_date: data.start_date,
    option_end_date: data.end_date,
    // option_create_date: '',
    option_update_date: Date.now(),
    // option_update_date: data.update_date,
    // delete: data.delete,
    // delete_member: data.delete_member,
    }, { new: true }
  )

  if (!!updateOption) {
    return updateOption;
  }

  throw createError(400, "找不到專案");
}

export {
  OptionCreateInput,
  OptionUpdateInput,
  doGetOwnerProjectOptions,
  doPostOwnerProjectOptions,
  doGetProjectOptions,
  doGetProjectOption,
  doPatchProjectOptions
}