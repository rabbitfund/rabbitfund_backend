import mongoose from 'mongoose';
const newsSchema = new mongoose.Schema({
  news_parent: {
    type: mongoose.Schema.Types.ObjectId, // 依附的專案ID(idNum)
    ref: 'Project',
    default: 0 // 預設為 0 => 系統層級的最新消息
  },
  news_title: { // 最新消息的標題
    type: String
  },
  news_content: { // 最新消息的內容
    type: String,
    trim: true
  },
  news_cover: { // 最新消息的封面圖片 (非必填)
    type: String
    // default: "/img/cover-news.png"
  },
  news_status: { // 最新消息的狀態
    type: Number,
    default: 0 // 預設 0-草稿 (0-草稿 / 1-審核中 / 2-進行中 / 3-已結束 / ... )
  },
  news_start_date: { // 最新消息的開始日期
    type: Date
  },
  news_end_date: { // 最新消息的結束日期
    type: Date,
    default: 9999/12/31 // 預設
  },
  news_create_date: { // 最新消息的建立日期
    type: Date,
    default: Date.now()
  },
  news_update_date: { // 最新消息的更新日期
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
const News = mongoose.model('News', newsSchema);

export default News;