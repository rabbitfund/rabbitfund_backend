import News from "../model/newsModels";
import * as fs from 'fs';

const initNews = async () => {
  const data = fs.readFileSync("./src/db/data/news.json", "utf-8");
  const news = JSON.parse(data);
  console.log(`取得${news.length}筆news`)
  try {
    await News.deleteMany();
    await News.insertMany(news);
    console.log('news資料初始化成功');
  } catch (err) {
    console.error('news資料初始化失敗', err);
  }
};

export {
  initNews
};