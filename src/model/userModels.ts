import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  user_email: { // 電子郵件 = 帳號
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
  user_hash_pwd: {
    type: String,
    required: [true, '缺少密碼欄位']
  },
  user_name: { // 個人名稱(顯示用)
    type: String
  },
  user_role: { // 身分，可以有多重身分
    type: [Number],
    default: [1] // 預設為1-贊助方 (0-管理者、1-贊助方、2-提案方...)
  },
  salt: { // random value
    type: String
  },
  login_method: { // 登入方式
    type: [String],
    enum: ["normal", "google"], // 一般登入 normal ／ 第三方登入 google
    default: ["normal"] // 預設登入方式為一般登入
  },
  oauth_google_id: { // 第三方登入資訊（google_id）
    type: String
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
  user_adress: {
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

export default User;