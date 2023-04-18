import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  ownerInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProposer',
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  option: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Option',
  },
  order_option_quantity: { // 回饋方案份數
    type: Number,
    required: true,
    min: 0,
  },
  order_extra: { // 額外贊助金額
    type: Number,
    min: 0,
  },
  order_total: { // 總價 (NOTE: option_price * order_option_quantity + order_extra)
    type: Number,
    min: 0,
  },
  order_note: { // 訂單備註
    type: String,
    trim: true
  },
  order_create_date: { // 訂單建立日期
    type: Date,
    default: Date.now()
  },
  order_status: { // 訂單狀態
    type: Number,
    default: 0 // 預設 0-未完成 (0-未完成 / 1-已完成 / ... )
  },
  order_shipping_status: { // 運送狀態
    type: Number,
    default: 0 // 預設為 0-等待出貨 (0-等待出貨 / 1-運送中 / 2-已送達 / ... )
  },
  order_shipping_date: { // 募資回饋商品送達日期
    type: Date
  },
  order_final_date: { // 訂單完成日期
    type: Date
  },
  order_feedback: { // 訂單完成後回饋
    type: String,
    trim: true
  },
  order_info: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderInfo',
  },
});
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;