![example workflow](https://github.com/rabbitfund/rabbitfund_backend/actions/workflows/main.yml/badge.svg)

# rabbitfund_backend
## Install
- ```
  npm install
  ```
- 建立 `.env` (格式請參考 `example.env`)

## 使用方法

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

## 建置流程
[參考此文件](doc/build.md)

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
### [Firebase](https://firebase.google.com/)
### [Uptimerobot](https://uptimerobot.com/)
### Discord Webhook
- Github
- Uptimerobot
