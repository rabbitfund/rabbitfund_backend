import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({path: './.env'});

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('資料庫連接成功'));