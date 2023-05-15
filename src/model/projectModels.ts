import mongoose from "mongoose";
const projectSchema = new mongoose.Schema(
  {
    project_title: {
      type: String,
      required: [true, "專案標題未填寫"],
    },
    project_summary: {
      // 專案摘要
      type: String,
    },
    project_content: {
      // 專案詳細內容 (編輯器內容)
      type: String,
      trim: true,
    },
    project_category: {
      // 專案類別
      type: [String],
      enum: ["校園", "公益", "市集"],
      required: true,
    },
    project_target: {
      // 募資目標金額
      type: Number,
      required: true,
      min: 0,
    },
    project_progress: {
      // 募資目前進度金額
      type: Number,
      required: true,
      min: 0,
    },
    project_status: {
      // 募資專案狀態
      type: Number,
      default: 0, // 預設 0-草稿 (0-草稿 / 1-審核中 / 2-進行中 / 3-已結束 / 4-未達標 / ...)
    },
    project_start_date: {
      // 專案開始日期
      type: Date,
    },
    project_end_date: {
      // 專案結束日期
      type: Date,
    },
    project_create_date: {
      // 專案建立日期
      type: Date,
      default: Date.now(),
    },
    project_update_date: {
      // 專案更新日期
      type: Date,
    },
    project_update_final_member: {
      // 專案最後更新人員
      type: String,
    },
    project_cover: {
      // 封面圖片連結
      type: String,
      required: true,
    },
    project_video: {
      // 專案影片連結
      type: String,
    },
    project_risks: {
      // 風險與變數
      type: String,
      trim: true,
    },
    project_tag: {
      // 標籤
      type: [String],
    },
    ownerInfo: {
      // 提案方資訊
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProposer",
    },
    delete: {
      // 被刪除
      type: Boolean,
      default: false,
    },
    delete_member: {
      // 刪除人員
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    option: {
      // 回饋方案
      type: [
        {
          // option: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Option",
        },
        // },
      ],
    },
    news: {
      // 最新消息
      type: [
        {
          // news: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "News",
          // },
        },
      ],
    },
    qas: {
      // 常見問答
      type: [
        {
          // qas: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Qas",
          // },
        },
      ],
    },
    order: {
      // 訂單資訊
      type: [
        {
          // order: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
          // },
        },
      ],
    },
  },
  {
    versionKey: false,
  }
);
const Project = mongoose.model("Project", projectSchema);

export default Project;
