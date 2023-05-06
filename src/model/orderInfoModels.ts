import mongoose from "mongoose";
const orderInfoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  payment_price: {
    // 關聯訂單總金額
    type: Number,
    min: 0,
    required: true,
  },
  payment_method: {
    // 付款方式
    type: String,
    enum: ["信用卡", "ATM", "信用卡分期"],
    required: true,
  },
  // payment_note: { // 因應不同方式的註記
  //   type: String,
  //   trim: true
  // },
  // payment_service: { // 客服註記 (進線紀錄 or 退款紀錄)
  //   type: String,
  //   trim: true
  // },
  payment_status: {
    // 付款狀態
    type: Number,
    default: 0, // 預設 0-未付款 (0-未付款 / 1-待付款 / 2-付款完成 / 3-付款失敗 / 4-取消交易 ... )
  },
  invoice_number: {
    // 發票號碼
    type: String,
  },
  invoice_date: {
    // 發票開立日期
    type: Date,
  },
  invoice_type: {
    // 發票類型
    type: String,
    enum: ["紙本發票", "電子載具", "三聯式發票"],
  },
  invoice_carrier: {
    // 發票載具
    type: String,
  },
  newebpay_tokens: {
    // 藍新金流 token（待定）
    type: [
      {
        aes_encrypt: String,
        sha_encrypt: String,
        token: String,
      },
    ],
  },
});
const OrderInfo = mongoose.model("OrderInfo", orderInfoSchema);

export default OrderInfo;
