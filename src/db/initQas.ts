import Qas from "../model/qasModels";
import * as fs from 'fs';

const initQas = async () => {
  const data = fs.readFileSync("./src/db/data/qas.json", "utf-8");
  const qas = JSON.parse(data);
  try {
    await Qas.deleteMany();
    await Qas.insertMany(qas);
    console.log('news資料初始化成功');
  } catch (err) {
    console.error('news資料初始化失敗', err);
  }
};

export {
  initQas
};