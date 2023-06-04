import OrderInfo from "../model/orderInfoModels";
import * as fs from 'fs';

const initOrderInfos = async () => {
  const data = fs.readFileSync("./src/db/data/orderInfos.json", "utf-8");
  const orderInfos = JSON.parse(data);
  console.log(`取得${orderInfos.length}筆orderInfo`)
  try {
    await OrderInfo.deleteMany();
    await OrderInfo.insertMany(orderInfos);
    console.log('Order Info資料初始化成功');
  } catch (err) {
    console.error('Order Info資料初始化失敗', err);
  }
};

export {
  initOrderInfos
};