import { User } from "../model/userModels";
// import { users } from "./data/user"
import * as fs from 'fs';

const initUsers = async () => {
  const data = fs.readFileSync("./src/db/data/users.json", "utf-8");
  const users = JSON.parse(data);
  console.log(`取得${users.length}筆user`)
  try {
    await User.deleteMany();
    await User.insertMany(users);
    console.log('User資料初始化成功');
  } catch (err) {
    console.error('User資料初始化失敗', err);
  }
};

export {
  initUsers
};