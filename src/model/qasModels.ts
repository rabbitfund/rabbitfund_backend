import mongoose from 'mongoose';
const qasSchema = new mongoose.Schema({
  qas_parent: {
    type: mongoose.Schema.Types.ObjectId, // 依附的專案ID(idNum)
    ref: 'Project',
    default: 0 // 預設為 0 => 系統層級的常見問答
  },
  qas_q: { // 常見問答的問題
    type: String,
    trim: true
  },
  qas_a: { // 常見問答的答案
    type: String,
    trim: true
  },
  qas_create_date: { // 常見問答的建立日期
    type: Date,
    default: Date.now()
  },
  qas_update_date: { // 常見問答的更新日期
    type: Date
  },
  check: { // 管理者審核
    type: Boolean,
    default: false // 預設為 false-未審閱 (true-已審閱、false-未審閱)
  },
  enables: { // 上下架與否
    type: Boolean,
    default: false // 預設為 false-下架 (true-上架、false-下架)
  }
});
const Qas = mongoose.model('Qas', qasSchema);

export default Qas;