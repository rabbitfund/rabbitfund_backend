import mongoose from 'mongoose';
const orderInfoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  adress: {
    type: [
      {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
      }
    ]
  },
  payment_price: { // 關聯訂單總金額
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  payment_method: { // 付款方式
    type: String,
    enum: ['信用卡', 'ATM', '信用卡分期'],
    required: true
  },
  payment_note: { // 因應不同方式的註記
    type: String,
    trim: true
  },
  payment_service: { // 客服註記 (進線紀錄 or 退款紀錄)
    type: String,
    trim: true
  },
  payment_status: { // 付款狀態
    type: Number,
    default: 3 // 預設 3-等待付款 (0-付款失敗 / 1-已完成 / 2-取消交易 / 3-等待付款 ... )
  },
  invoice_number: { // 發票號碼
    type: String
  },
  invoice_date: { // 發票開立日期
    type: Date
  },
  invoice_type: { // 發票類型
    type: String,
    enum: ['紙本發票', '電子載具', '三聯式發票']
  },
  invoice_carrier: { // 發票載具
    type: String
  },
  newebpay_tokens: { // 藍新金流 token（待定）
    type: [
      {
        aes_encrypt: String,
        sha_encrypt: String,
        token: String
      }
    ]
  }
});
const OrderInfo = mongoose.model('OrderInfo', orderInfoSchema);

module.exports = OrderInfo;