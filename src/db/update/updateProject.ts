import Project from "../../model/projectModels";

type UpdateFields = {
  project_create_date: Date;
  project_update_date?: Date;
  project_start_date?: Date;
  project_end_date?: Date;
}

const postponeProject = async (nYears: number = 1) => {
  const projectDocuments = await Project.find();

  for (const projectDocument of projectDocuments) {
    const updateFields: UpdateFields = {
      project_create_date: new Date(projectDocument.project_create_date.setFullYear(projectDocument.project_create_date.getFullYear() + nYears)),
    };

    if (projectDocument.project_start_date) {
      updateFields.project_start_date = new Date(projectDocument.project_start_date.setFullYear(projectDocument.project_start_date.getFullYear() + nYears));
    }

    if (projectDocument.project_end_date) {
      updateFields.project_end_date = new Date(projectDocument.project_end_date.setFullYear(projectDocument.project_end_date.getFullYear() + nYears));
    }

    if (projectDocument.project_update_date) {
      updateFields.project_update_date = new Date(projectDocument.project_update_date.setFullYear(projectDocument.project_update_date.getFullYear() + nYears));
    }

    const newProject = await Project.findByIdAndUpdate(projectDocument._id, updateFields, { new: true });

    if (!newProject) {
      console.log('更新 Project 失敗');
    } else {
      console.log('更新 Project 成功');
    }
  }
}

export {
  postponeProject
};