import Project from "../model/projectModels";
import * as fs from 'fs';

const initProjects = async () => {
  const data = fs.readFileSync("./src/db/data/projects.json", "utf-8");
  const projects = JSON.parse(data);
  console.log(`取得${projects.length}筆project`)
  try {
    await Project.deleteMany();
    await Project.insertMany(projects);
    console.log('Project資料初始化成功');
  } catch (err) {
    console.error('Project資料初始化失敗', err);
  }
};

export {
  initProjects
};