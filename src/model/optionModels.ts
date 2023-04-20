import mongoose from 'mongoose';
const optionSchema = new mongoose.Schema({
  option_parent: {
    type: mongoose.Schema.Types.ObjectId, // 依附的專案ID(idNum)
    ref: 'Project'
  },
  option_name: { // 回饋方案名稱
    type: String,
    required: true
  },
  option_price: { // 回饋方案金額
    type: Number,
    required: true,
    min: 0
  },
  option_total: { // 回饋方案總份數(限額)
    type: Number,
    required: true,
    min: 0
  },
  option_content: { // 回饋方案內容
    type: String,
    trim: true
  },
  option_cover: { // 回饋方案封面圖片
    type: String
    // default: "/img/cover-news.png"
  },
  option_status: { // 回饋方案狀態
    type: Number,
    default: 0 // 預設 0-進行中 (0-進行中 / 1-已額滿 / ... )
  },
  option_start_date: { // 回饋方案的開始日期
    type: Date
  },
  option_end_date: { // 回饋方案的結束日期
    type: Date
  },
  option_create_date: { // 回饋方案的建立日期
    type: Date,
    default: Date.now()
  },
  option_update_date: { // 回饋方案的更新日期
    type: Date
  }
});
const Option = mongoose.model('Option', optionSchema);

export default Option;