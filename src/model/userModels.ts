import mongoose from "mongoose";
import validator from "validator";

export enum UserRole {
  SUPPORTER = 0, //0-贊助方 as default
  PROVIDER = 2, //2-提案方
  ADMIN = 4, //4-管理者
}
export enum LoginMethod {
  NORMAL = 0, // 一般登入 normal
  GOOGLE = 1, // google 登入
  FACEBOOK = 2, // facebook 登入
  LINE = 3, // line 登入
}

const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: [true, "個人名稱未填寫"],
    },
    user_hash_pwd: {
      type: String,
      // minlength: [4, '密碼最少須 4 個字'],
      // maxlength: [20, '密碼最多 20 個字'],
      required: [true, "缺少密碼欄位"],
      select: false,
    },
    user_email: {
      type: String,
      required: [true, "電子郵件未填寫"],
      unique: true,
      lowercase: true,
      // 自訂驗證，安裝套件 npm i validator
      validate: {
        validator(value: string) {
          return validator.isEmail(value);
        },
        message: "信箱格式不正確",
      },
    },
    user_roles: {
      // 身分，可以有多重身分
      type: [Number],
      default: [UserRole.SUPPORTER], // 預設為0-贊助方 (4-管理者、0-贊助方、2-提案方...)
      enum: UserRole,
    },
    salt: {
      // random value
      type: String,
    },
    login_method: {
      // 登入方式
      type: [Number],
      enum: LoginMethod, // 一般登入 normal ／ 第三方登入 google
      default: [LoginMethod.NORMAL], // 預設登入方式為一般登入
    },
    oauth_google_id: {
      // 第三方登入資訊（google_id）
      type: String,
    },
    user_create_date: {
      // 註冊日期
      type: Date,
      default: Date.now(),
      // select: false // 隱藏屬性，查詢時不返回
    },
    user_update_date: {
      // 最後一次登入時間
      type: Date,
    },
    user_cover: {
      type: String,
      default: "/img/avatar.png", // 可以預設一個兔兔大頭貼 (會員版)
    },
    user_phone: {
      // 行動電話
      type: String,
    },
    user_intro: {
      // 自我介紹
      type: String,
      trim: true,
    },
    user_website: {
      // 相關網站
      type: String,
    },
    user_interests: {
      // 興趣陣列 [興趣1, 興趣2 ...]
      type: Array,
    },
    user_like: {
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
    // user_like: { 多對多的關聯，其中一個用戶可以對多個項目進行讚，每個項目可以被多個用戶讚。
    //   type: [
    //     {
    //       likeProjects: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Projects'
    //       }
    //     }
    //   ]
    // }
    // user_like: { 一對多的關聯，其中一個用戶可以對多個項目進行讚，但是每個項目只能被一個用戶讚。
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Projects',
    // }
  },
  {
    versionKey: false,
  }
);

export const User = mongoose.model("User", userSchema);
