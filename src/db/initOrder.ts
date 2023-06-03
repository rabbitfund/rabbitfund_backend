import Order from "../model/orderModels";
import * as fs from 'fs';

const initOrders = async () => {
  const data = fs.readFileSync("./src/db/data/orders.json", "utf-8");
  const orders = JSON.parse(data);
  try {
    await Order.deleteMany();
    await Order.insertMany(orders);
    console.log('Order資料初始化成功');
  } catch (err) {
    console.error('Order資料初始化失敗', err);
  }
};

export {
  initOrders
};