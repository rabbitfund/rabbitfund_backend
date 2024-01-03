import mongoose from "mongoose";
import dotenv from "dotenv";
import { postponeQas } from "../db/update/updateQas";
import { postponeUser } from "../db/update/updateUser";
import { postponeUserProposer } from "../db/update/updateUserProposer";
import { postponeProject } from "../db/update/updateProject";
import { postponeOption } from "../db/update/updateOption";
import { postponeNews } from "../db/update/updateNews";
import { postponeOrder } from "../db/update/updateOrder";
// import { postponeOrderInfo } from "../db/update/updateOrderInfo";

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

  // await postponeQas();
  await postponeUser();
  await postponeUserProposer();
  await postponeProject();
  await postponeOption();
  await postponeNews();
  await postponeOrder();
  // await postponeOrderInfo();
  console.log("資料庫更新資料完成");
}).then(() => {
  mongoose.connection.close();
});