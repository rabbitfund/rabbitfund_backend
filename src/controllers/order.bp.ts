import validator from "validator";
import createError from "http-errors";
import { isValidObjectId } from "../utils/objectIdValidator";

type OrderCreateInput = {
  userId: string;
  projectId: string;
  optionId: string;
  orderQuantity: number;
  orderExtra: number;
  orderTotal: number;
  orderNote: string;
  paymentMethod: string;
  invoice_type: string;
  invoice_carrier: string;
};

const verifyOrderCreateData = (data: OrderCreateInput): boolean => {
  return (
    isValidObjectId(data.userId) &&
    isValidObjectId(data.projectId) &&
    isValidObjectId(data.optionId) &&
    data.orderQuantity >= 1 &&
    data.orderExtra >= 0 &&
    data.orderTotal >= 0 &&
    data.orderNote.length <= 100 &&
    !isEmpty(data.paymentMethod) &&
    validator.isIn(data.paymentMethod, ["信用卡", "ATM", "信用卡分期"]) &&
    validator.isIn(data.invoice_type, ["紙本發票", "電子載具", "三聯式發票"])
  );
};

async function doOrderCreate(data: OrderCreateInput) {
  const user = await User.findById(data.userId);
  if (!user) {
    throw createError(400, "找不到會員");
  }
  const project = await Project.findById(data.projectId);
  if (!project) {
    throw createError(400, "找不到專案");
  }
  const option = await Option.findById(data.optionId);
  if (!option) {
    throw createError(400, "找不到方案");
  }

  const order = await Order.create({
    user_id: data.userId,
    project_id: data.projectId,
    option_id: data.optionId,
    order_quantity: data.orderQuantity,
    order_extra: data.orderExtra,
    order_total: data.orderTotal,
    order_note: data.orderNote,
    payment_method: data.paymentMethod,
    invoice_type: data.invoice_type,
    invoice_carrier: data.invoice_carrier,
  });

  return order;
}
const isEmpty = (text: string): boolean => {
  return text ? false : true;
};
export { OrderCreateInput, verifyOrderCreateData, doOrderCreate };
