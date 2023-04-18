import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: [true, '帳號未填寫']
  },
  user_hash_pwd: {
    type: String,
    minlength: [4, '密碼最少須 4 個字'],
    maxlength: [20, '密碼最多 20 個字'],
    required: [true, '缺少密碼欄位']
  },
  user_email: {
    type: String,
    required: [true, '電子郵件未填寫'],
    unique: true
    // 自訂驗證，安裝套件 npm i validator
    // validate: {
    //   validator (value) {
    //     return validator.isEmail(value)
    //   },
    //   message: '信箱格式不正確'
    // }
  },
  user_role: { // 身分
    type: Number,
    default: 1 // 預設為會員 (0-後台最高權限管理者、1-會員)
  },
  is_proposer: { // 是否為提案方
    type: Boolean,
    default: false  // 預設為贊助方 (false-贊助方、true-提案方)
  },
  oauth: { // 第三方登入資訊（待定）
    type: String,
  },
  tokens: { // （待定）
    type: [
      {
        access_token: String,
        refresh_token: String,
        jwt: String
      }
    ]
  },
  is_verified: { // 是否有驗證
    type: Boolean
  },
  user_create_date: { // 註冊日期
    type: Date,
    default: Date.now()
    // select: false // 隱藏屬性，查詢時不返回
  },
  user_update_date: { // 最後一次登入時間
    type: Date
  },
  user_cover: {
    type: String,
    default: "/img/avatar.png" // 可以預設一個兔兔大頭貼 (會員版)
  },
  user_phone: { // 行動電話
    type: String
  },
  user_intro: { // 自我介紹
    type: String,
    trim: true
  },
  user_website: { // 相關網站
    type: String
  },
  user_interests: { // 興趣陣列 [興趣1, 興趣2 ...]
    type: Array
  },
  user_like: { // 追蹤專案
    type: [
      {
        likeProjects: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Project'
        }
      }
    ]
  }
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
});
const User = mongoose.model('User', userSchema);

module.exports = User;