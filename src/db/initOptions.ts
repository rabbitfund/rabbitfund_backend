import Option from "../model/optionModels";
import * as fs from 'fs';

const initOptions = async () => {
  const data = fs.readFileSync("./src/db/data/options.json", "utf-8");
  const options = JSON.parse(data);
  console.log(`取得${options.length}筆option`)
  try {
    await Option.deleteMany();
    await Option.insertMany(options);
    console.log('option資料初始化成功');
  } catch (err) {
    console.error('option資料初始化失敗', err);
  }
};

export {
  initOptions
};