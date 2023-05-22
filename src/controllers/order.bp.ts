import validator from "validator";
import createError from "http-errors";
import { isValidObjectId } from "../utils/objectIdValidator";
import { User } from "../model/userModels";
import Project from "../model/projectModels";
import Option from "../model/optionModels";
import Order from "../model/orderModels";
import OrderInfo from "../model/orderInfoModels";
import { log } from "console";

type OrderCreateInput = {
  user_id: string;
  project_id: string;
  option_id: string;
  order_option_quantity: number;
  order_extra: number;
  order_total: number;
  order_note: string;
  payment_method: string;
  invoice_type: string;
  invoice_carrier: string;
};

const verifyOrderCreateData = (data: OrderCreateInput): boolean => {
  console.log(data);
  return (
    isValidObjectId(data.user_id) &&
    isValidObjectId(data.project_id) &&
    isValidObjectId(data.option_id) &&
    data.order_option_quantity >= 1 &&
    data.order_extra >= 0 &&
    data.order_total >= 0 &&
    data.order_note.length <= 100 &&
    !isEmpty(data.payment_method) &&
    validator.isIn(data.payment_method, ["信用卡", "ATM", "信用卡分期"]) &&
    validator.isIn(data.invoice_type, ["紙本發票", "電子載具", "三聯式發票"])
  );
};

async function doOrderCreate(data: OrderCreateInput) {
  const user = await User.findById(data.user_id);
  if (!user) {
    throw createError(400, "找不到會員");
  }
  // const project = await Project.findById(data.projectId);
  const project = await Project.find({
    _id: data.project_id,
    project_status: 2, //must 2-進行中
    delete: false,
  }).exec();
  if (!project || project.length === 0) {
    throw createError(400, "找不到專案");
  }

  // const option = await Option.findById(data.option_id);
  const option = (await Option.find({
    _id: data.option_id,
    option_status: 2, //must 2-進行中
    delete: false,
  })) as any;
  if (!option || option.length === 0) {
    throw createError(400, "找不到方案");
  }

  // confirm order_total
  const orderTotal =
    option[0].option_price * data.order_option_quantity + data.order_extra;
  if (orderTotal !== data.order_total) {
    throw createError(400, "訂單總金額錯誤");
  }

  const orderInfo = await OrderInfo.create({
    user: data.user_id,
    payment_price: data.order_total,
    payment_method: data.payment_method,
    invoice_type: data.invoice_type,
    invoice_carrier: data.invoice_carrier,
  });

  const order = await Order.create({
    user: data.user_id,
    ownerInfo: project[0].ownerInfo,
    project: data.project_id,
    option: data.option_id,
    order_option_quantity: data.order_option_quantity,
    order_extra: data.order_extra,
    order_total: data.order_total,
    order_note: data.order_note,
    order_info: orderInfo._id,
  });

  return order;
}

async function doGetMeOrders(userId: string, page: string) {
  const pageNum = parseInt(page);
  const perPage = 10;

  const orders = await Order.find({ user: userId })
    .limit(perPage)
    .skip(perPage*(pageNum-1));
  

  // if (!orders || orders.length === 0) {
  //   throw createError(400, "找不到贊助紀錄");
  // }

  return orders
}

const isEmpty = (text: string): boolean => {
  return text ? false : true;
};
export { OrderCreateInput, verifyOrderCreateData, doOrderCreate, doGetMeOrders };
