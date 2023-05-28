import { User } from "../model/userModels";
import { users } from "./data/user"

const initUsers = async () => {
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