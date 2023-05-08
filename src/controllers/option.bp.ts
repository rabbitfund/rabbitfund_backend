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
}


async function doGetOwnerProjectOptions(projectId: string) {
  const project = await Project.findById(projectId)
  if (!project) {
    throw createError(400, "找不到專案");
  }
  
  const option = await Option.find({
    option_parent: projectId
  }).exec();
  
  if (!option || option.length === 0) {
    throw createError(400, "找不到方案");
  }
  return option
}

async function doPostOwnerProjectOptions(projectId: string, data: OptionCreateInput) {
  const project = await Project.findById(projectId)
  if (!project) {
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
    option_update_date: Date.now()
  })

  return option;
}

async function doGetProjectOptions(projectId: string) {
  const project = await Project.findById(projectId)
  if (!project) {
    throw createError(400, "找不到專案");
  }

  const options = await Option.find({
    option_parent: projectId
  }).exec();
  
  if (!options || options.length === 0) {
    throw createError(400, "找不到方案");
  }

  // filtered out specific info 
  const filteredOptions = options.map(option => {
    const {
      option_create_date: _,
      option_update_date: __,
      ...filteredOption
    } = option.toObject();
    return filteredOption
  })

  return filteredOptions
}

export {
  OptionCreateInput,
  doGetOwnerProjectOptions,
  doPostOwnerProjectOptions,
  doGetProjectOptions
}