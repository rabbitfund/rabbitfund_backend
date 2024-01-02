import mongoose from "mongoose";
import dotenv from "dotenv";
import { postponeQas } from "../db/update/updateQas";

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

  await postponeQas();
  console.log("資料庫更新資料完成");
}).then(() => {
  mongoose.connection.close();
});