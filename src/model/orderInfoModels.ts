import mongoose from "mongoose";
const orderInfoSchema = new mongoose.Schema(
  {
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
    enum: ["WEBATM", "CREDIT"],
    // required: true,
    // TODO: 由於 "VACC", "BARCODE", "CVS" 這3種付款方式會需要另外以 custom_url 的方式設定導回商店的頁面，故時間許可再實作這項。
    // NOTE: 藍新金流以英文代號方式回應付款方式
    // CREDIT=信用卡付款
    // VACC=銀行 ATM 轉帳付款
    // WEBATM=網路銀行轉帳付款
    // BARCODE=超商條碼繳費
    // CVS=超商代碼繳費
    // LINEPAY=LINE Paya 付款
    // ESUNWALLET=玉山 Wallet
    // TAIWANPAY=台灣 Pay
    // CVSCOM = 超商取貨付款
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
    // TODO: 藍新金流有查詢指定訂單資料的 api ，會以數字回傳 TradeStatus 支付狀態 ，目前此 payment_status 為我們自己定義的狀態值，待時間許可再實作這項。
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
  newebpay_timeStamp: {
    // 藍新金流所需交易時間戳 - 格式 '1683993023'
    // NOTE: 由於藍新金流請求時須帶入我們自己定義的訂單編號及訂單建立的時間戳，為了方便管理將藍新金流的 時間戳 TimeStamp = 訂單編號 MerchantOrderNo，而非使用 orderInfo ObjectId。
    // => 也是可以用 ObjectId 當訂單編號 待實作後調整此註解
    type: String,
    required: true,
  },
  newebpay_aes_encrypt: {
    // aes 加密字串
    type: String
  },
  newebpay_sha_encrypt: {
    // sha256 加密字串
    type: String
  },
  newebpay_tradeNo: {
    // 在藍新金流的交易序號
    type: String
  },
  newebpay_IP: {
    // 在藍新金流交易時付款人的 IP
    type: String
  },
  newebpay_escrowBank: {
    // 款項保管銀行 <- HNCB = 華南銀行
    type: String
  },
  newebpay_payBankCode: {
    // 付款人金融機構代碼
    type: String
  },
  newebpay_payerAccount5Code: {
    // 付款人金融機構帳號末五碼
    type: String
  },
  newebpay_payTime: {
    // 藍新金流定義：收到款項的支付完成時間
    type: String // 詭異的日期格式 "2023-05-1402:20:43"，所以用 strimg 儲存
  }
},
{
  versionKey: false,
}
);
const OrderInfo = mongoose.model("OrderInfo", orderInfoSchema);

export default OrderInfo;
