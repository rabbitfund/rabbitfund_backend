import validator from "validator";
import createError from "http-errors";
import * as crypto from 'crypto';
// import axios from 'axios';
// import https from 'https';
import dotenv from "dotenv";
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

interface IUser {
  user_name: string;
  user_email: string;
}

interface IProject {
  project_title: string;
}

interface IOption {
  option_name: string;
}

interface IOrderInfo {
  newebpay_timeStamp: number;
}

interface OrderDataInput {
  _id: string;
  user: {
    _id: string;
    user_name: string;
    user_email: string;
  };
  project: {
    _id: string;
    project_title: string;
  };
  option: {
    _id: string;
    option_name: string;
  };
  order_total: number;
  order_info: {
    _id: string;
    newebpay_timeStamp: string;
  };
}

type OrderCheckInput = {
  order_id: string;
  user_name: string;
  user_email: string;
  itemDesc: string;
  timeStamp: string;
  amt: number;
  newebpay_aes_encrypt?: string;
  newebpay_sha_encrypt?: string;
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
    // !isEmpty(data.payment_method) &&
    validator.isIn(data.payment_method, ["WEBATM", "CREDIT"]) &&
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
    // payment_method: data.payment_method,
    newebpay_timeStamp: Math.round(new Date().getTime() / 1000), // NOTE: 藍新金流有限制時間戳長度 10 位數
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

async function getOrderData(orderId: string) {
  try {
    const orderData = await Order.findById(orderId)
      .populate<{ user: IUser }>('user', { user_name: 1, user_email: 1 })
      .populate<{ project: IProject }>('project', { project_title: 1 })
      .populate<{ option: IOption }>('option', { option_name: 1 })
      .populate<{ order_info: IOrderInfo }>('order_info', { newebpay_timeStamp: 1 })
      .select('order_total')
      .lean()
      .exec();

    console.log('getOrderData', orderId, orderData);
      
    if (!orderData) {
      throw createError(400, "找不到訂單資料");
    }

    const aesEncrypt = create_mpg_aes_encrypt(orderData) // 交易資料
    console.log('aesEncrypt：', aesEncrypt);
      
    const shaEncrypt = create_mpg_sha_encrypt(aesEncrypt) // 交易驗證用
    console.log('shaEncrypt：', shaEncrypt);

    const UpdateOrderInfo = await OrderInfo.findOneAndUpdate(
      { _id: orderData.order_info },
      {
        $set: {
          newebpay_aes_encrypt: aesEncrypt,
          newebpay_sha_encrypt: shaEncrypt
        }
      },
      { new: true }
    )

    console.log('UpdateOrderInfo: ', UpdateOrderInfo)

    const orderDataItem: OrderCheckInput = {
      order_id: orderData._id.toString(),
      user_name: orderData.user?.user_name || '',
      user_email: orderData.user?.user_email || '',
      amt: orderData.order_total || 0,
      itemDesc: orderData.project?.project_title || '',
      timeStamp: orderData.order_info.newebpay_timeStamp.toString(),
      newebpay_aes_encrypt: aesEncrypt,
      newebpay_sha_encrypt: shaEncrypt
    };

    console.log('Order Data Item:', orderDataItem);

    return orderDataItem

  } catch (error) {
    console.error(error)
    // throw createError(400, "找不到訂單資料");
  }
}

async function doOrderReturn(orderReturn: any) {
  console.count('/return');
  console.log('doOrderReturn', orderReturn);

  try {
    // 將回傳的資料解密
    const info = create_mpg_aes_decrypt(orderReturn.TradeInfo)
  
    // 將解密後的資料轉換為字串形式
    const queryString = new URLSearchParams(info.Result).toString();
    console.log('doOrderReturn', queryString);
    
    const orderId = info.Result.MerchantOrderNo
    // NOTE: 此處不檢查訂單的存在與否，僅將金流的資料傳給前端頁面
    const redirectUrl = process.env.Newebpay_redirect + orderId + '/transaction-result/?' + queryString
    
    // console.log('doOrderReturn', redirectUrl);

    return redirectUrl

  } catch (error) {
    console.error(error)
  }
}
async function doOrderNotify(orderNotify: any) {
  console.count('/notify');
  console.log('doOrderNotify', orderNotify);

  try {
    // 將回傳的資料解密
    const info = create_mpg_aes_decrypt(orderNotify.TradeInfo)
    // console.log('/mpg_gateway_notify_url', info.Result);

    const orderId = info.Result.MerchantOrderNo

    // 檢查該筆訂單存不存在，並更新訂單狀態
    // console.log(info, info.Result.MerchantOrderNo);
    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          order_status: 2, // 更新訂單狀態為 2-已完成
          order_final_date: new Date(),
          order_shipping_status: 3 // 3-已完成
        }
      }
    )
    if (!order) {
      throw createError(400, '找不到訂單')
    }

    console.log('doOrderNotify order', order);
    // console.log('doOrderNotify order.order_info', order.order_info);

    // 取出訂單資料並將藍新金流回傳的交易結果更新
    // console.log(orders[info.Result.MerchantOrderNo]);
    const updateOrder = await OrderInfo.findByIdAndUpdate(
      order.order_info,
      {
        $set: {
          order_status: 2, // 更新訂單狀態為 2-已完成
          order_final_date: new Date(),
          payment_status: 2, // 更新付款狀態為 2-付款完成 / THINK: 貌似有收到 notify 就一定算成功交易？
          payment_method: info.Result.PaymentType,
          newebpay_tradeNo: info.Result.TradeNo,
          newebpay_escrowBank: info.Result.PayBankCode,
          newebpay_payBankCode: info.Result.PayBankCode,
          newebpay_payerAccount5Code: info.Result.PayerAccount5Code,
          newebpay_payTime: info.Result.PayTime // 詭異的日期格式 "2023-05-1402:20:43"
        },
      },
      { new: true }
    );
  
    console.log('Order Notify', updateOrder);
  } catch (error) {
    console.error(error);
  }
}

const isEmpty = (text: string): boolean => {
  return text ? false : true;
};


// 組成藍新金流所需字串 - 特別注意轉換字串時，ItemDesc、Email 會出現問題，要使用 encode 來轉換成藍新金流要的格式
function genDataChain(order: any): string {
  if (order === null) {
    // 處理 null 的情況
    return '';
  }
  // console.log('genDataChain(order):', order);
 
  const orderData: string = `MerchantID=${process.env.Newebpay_MerchantID}&RespondType=JSON&TimeStamp=${order.order_info.newebpay_timeStamp}&Version=${process.env.Newebpay_Version}&MerchantOrderNo=${order._id}&Amt=${order.order_total}&ItemDesc=${encodeURIComponent(order.option.option_name)}&Email=${encodeURIComponent(order.user.user_email)}`
  
  console.log('genDataChain:', orderData);

  // TODO: 有空再實作 "CustomerURL 商店取號網址"，要將此資訊加入 TradeInfo，一起傳給藍新
  return orderData;
}

// 使用 aes 加密
// $edata1=bin2hex(openssl_encrypt($data1, "AES-256-CBC", $key, OPENSSL_RAW_DATA, $iv));
function create_mpg_aes_encrypt(TradeInfo: any): string {
  const encrypt = crypto.createCipheriv('aes256', process.env.Newebpay_HashKey!, process.env.Newebpay_HashIV!); // 製作加密資料
  const enc = encrypt.update(genDataChain(TradeInfo), 'utf8', 'hex'); // 將訂單內容加密
  return enc + encrypt.final('hex');
}

// sha256 加密
// $hashs="HashKey=".$key."&".$edata1."&HashIV=".$iv;
function create_mpg_sha_encrypt(aesEncrypt: any): string {
  const sha = crypto.createHash('sha256');
  const plainText: string = `HashKey=${process.env.Newebpay_HashKey}&${aesEncrypt}&HashIV=${process.env.Newebpay_HashIV}`;

  return sha.update(plainText).digest('hex').toUpperCase();
}

// 將 aes 解密
function create_mpg_aes_decrypt(TradeInfo: any): any {
  const decrypt = crypto.createDecipheriv('aes256', process.env.Newebpay_HashKey!, process.env.Newebpay_HashIV!);
  decrypt.setAutoPadding(false);
  const text = decrypt.update(TradeInfo, 'hex', 'utf8');
  const plainText = text + decrypt.final('utf8');
  const result = plainText.replace(/[\x00-\x20]+/g, '');
  return JSON.parse(result);
}

export { OrderCreateInput, OrderDataInput, OrderCheckInput, verifyOrderCreateData, doOrderCreate, doGetMeOrders, getOrderData, doOrderCheck, doOrderReturn, doOrderNotify };
