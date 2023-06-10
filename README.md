![example workflow](https://github.com/rabbitfund/rabbitfund_backend/actions/workflows/main.yml/badge.svg)

# rabbitfund_backend
## Install
- ```
  npm install
  ```
- 建立 `.env` (格式請參考 [`example.env`](example.env))

## How to use
### 開發
```
npm run start
```

### 測試
```
npm run test
```

### 計算測試覆蓋率
```
npm run coverage
```
> 詳細測試報告在 `/coverage/index.html`

### 透過 postman 產生 openAPI 文件
```
npm run postman
```
> postman collection 檔案在[這裡](doc/倍而兔募資平台.postman_collection.json)

### 隨機生成資料
```
node src/db/createData.js <filenames>  
```
- `filenames` 為 optional
- `filenames` 只能是以下這幾種
  - `users`
  - `proposers`
  - `projects`
  - `options`
  - `qas`
  - `news`
  - `orders`
  - `orderInfos`
  - `likes`
> 例如： `node src/db/createData.js users proposers` 就只會更新 `users.json` 和 `proposers.json` 這兩個檔案

### 初始化資料庫的資料
```
npm run init
```
> 資料檔案在[這裡](src/db/data)

## 建置流程
[參考此文件](doc/build.md)

---

# 技術
## 後端框架
### [Express](https://expressjs.com/)
- 為熱門的 Node.js 網頁框架

## 資料庫
### [MongoDB (Atlas)](https://www.mongodb.com/cloud/atlas/register)

### 假資料準備
1. 使用 chatGPT 產生專案的文案
2. 撰寫腳本，將文案整理成合適的格式，並加上隨機的數字、日期等
3. 將建立好的資料上傳到資料庫

## CI/CD
### [Vitest](https://vitest.dev/)
- [測試檔案位置](/test)
- 大部分 API 功能都有寫測試，目前先以應當成功執行的測試為主

### [Github Actions](https://github.com/features/actions)
- [設定檔](/.github/workflows/main.yml)
- 由 Github Actions 負責 CI，每次更新都會執行 Vitest 的測試

### [Render](https://render.com/)
- [專案部屬位置](https://rabbitfund-backend.onrender.com)
- 在 Render 部屬專案，可以做到自動化部屬 (CD)

## API 文件
### [Swagger](https://swagger.io/)
- [文件連結](https://rabbitfund-backend.onrender.com/docs/)

## 串接服務
### [藍新金流](https://www.newebpay.com/)
- 整合藍新金流供贊助募資專案時使用

### [Firebase](https://firebase.google.com/)
- 負責儲存圖片

### [Uptimerobot](https://uptimerobot.com/)
- 定時確認後端狀態，並確保後端隨時都可以迅速回應

### Discord Webhook
- Github
- Uptimerobot
