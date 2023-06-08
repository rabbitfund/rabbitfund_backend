import mongoose from "mongoose";
import dotenv from "dotenv";
import { initUsers } from "../db/initUser"
import { initProposers } from "../db/initProposer";
import { initProjects } from "../db/initProject";
import { initOptions } from "../db/initOptions";
import { initQas } from "../db/initQas";
import { initNews } from "../db/initNews";
import { initOrders } from "../db/initOrder";
import { initOrderInfos } from "../db/initOrderInfo";
import { initLikes } from "../db/initLikes";

dotenv.config({ path: "./.env" });

const DB = process.env.MONGODB_CONNECT_STRING!.replace(
  "<user>",
  process.env.MONGODB_USER!
)
  .replace("<password>", process.env.MONGODB_PASSWORD!)
  .replace("<database>", process.env.MONGODB_DATABASE!);
// const DB = 'mongodb://localhost:27017/test'

mongoose.connect(DB).then(async () => {
  console.log("資料庫連接成功");
  await initUsers();
  await initProposers();
  await initProjects();
  await initOptions();
  await initQas();
  await initNews();
  await initOrders();
  await initOrderInfos();
  await initLikes();
  console.log("資料庫初始化資料完成");
}).then(() => {
  mongoose.connection.close();
});