import UserLikeProject from "../model/userLikeProjectModels";
import * as fs from 'fs';

const initLikes = async () => {
  const data = fs.readFileSync("./src/db/data/likes.json", "utf-8");
  const likes = JSON.parse(data);
  try {
    await UserLikeProject.deleteMany();
    await UserLikeProject.insertMany(likes);
    console.log('user like project資料初始化成功');
  } catch (err) {
    console.error('user like project資料初始化失敗', err);
  }
};

export {
  initLikes
};