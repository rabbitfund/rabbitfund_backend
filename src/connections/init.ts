import mongoose from "mongoose";
import dotenv from "dotenv";
import { initUsers } from "../db/initUser"
import { initProposers } from "../db/initProposer";
import { initProjects } from "../db/initProject";

dotenv.config({ path: "./.env" });

const DB = process.env.MONGODB_CONNECT_STRING.replace(
  "<user>",
  process.env.MONGODB_USER
)
  .replace("<password>", process.env.MONGODB_PASSWORD)
  .replace("<database>", process.env.MONGODB_DATABASE);
// const DB = 'mongodb://localhost:27017/test'

mongoose.connect(DB).then(async () => {
  console.log("資料庫連接成功");
  await initUsers();
  await initProposers();
  await initProjects();
  console.log("資料庫初始化資料完成");
}).then(() => {
  mongoose.connection.close();
});