import mongoose from "mongoose";
const userProposerSchema = new mongoose.Schema(
  {
    proposer_name: {
      // 提案方團隊名稱
      type: String,
      required: [true, "團隊名稱未填寫"],
    },
    proposer_create: {
      // 提案方創建專案的人
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    proposer_group: {
      // 提案方團隊 (多人團隊)
      type: [
        {
          proposer_member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        },
      ],
    },
    proposer_create_date: {
      // 建立提案的時間
      type: Date,
      default: Date.now(),
    },
    proposer_update_date: {
      // 最後一次更新提案的時間
      type: Date,
    },
    proposer_cover: {
      type: String,
      default: "/img/avatar-proposer.png", // 可以預設一個兔兔大頭照 (提案方版)
    },
    proposer_email: {
      type: String,
      required: [true, "電子郵件未填寫"],
      unique: true,
      // 自訂驗證，安裝套件 npm i validator
      // validate: {
      //   validator (value) {
      //     return validator.isEmail(value)
      //   },
      //   message: '信箱格式不正確'
      // }
    },
    proposer_phone: {
      // 行動電話
      type: String,
    },
    proposer_tax_id: {
      // 統一編號
      type: Number,
      minlength: [8, "請確認統一編號格式"],
      maxlength: [8, "請確認統一編號格式"],
      required: true,
      unique: true,
    },
    proposer_intro: {
      // 自我介紹
      type: String,
      trim: true,
    },
    proposer_website: {
      // 相關網站
      type: String,
    },
    proposer_project: {
      // 提案方擁有的專案
      type: [
        {
          projects: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
          },
        },
      ],
    },
    proposer_like: {
      // 追蹤專案
      type: [
        {
          likeProjects: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
          },
        },
      ],
    },
  },
  {
    versionKey: false,
  }
);
const UserProposer = mongoose.model("UserProposer", userProposerSchema);

export default UserProposer;
