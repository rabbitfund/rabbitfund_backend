# 假資料的準備
## 前言
一開始對於假資料的準備沒有放太多心力，殊不知，到了專案後期，對假資料的品質要求越來越高，主要遇到的問題大致上有以下三點
- 欄位不完整
- 數值格式不正確
- 多樣性不夠

### 欄位不完整
在專案早期，儘管已經有規劃 DB schema，但是 API 還在開發中，有些彼此互相關聯的資料在 API 不完整的情況下是無法輕鬆準備好的，尤其時 object ID 的部分更是如此。因此，一開始為了盡快確認 API 沒問題，只會準備最低程度的假資料 (只準備會檢查的欄位)。

### 數值格是不正確
到中期開始串接 API 時，當初隨手添加的假資料格式不正確的問題開始顯現，例如：網址。API 檢查時，只會確認是否為字串 (頂多再多檢查是否符合 URL 格式)，不會真的去確認該連結是否真的存在。

### 多樣性不夠
到了專案後期，為了讓畫面好看，單一的資料不再符合需求，需要大量內容不同的資料。以這次專案為例，光首頁就會呈現 10 個以上的專案，後面在專案搜尋時，還可以對專案類別、關鍵字等進行搜尋，此時沒有數十個專案是沒辦法讓畫面看起來逼真的。

## 資料格式
依據資料內容，大致上可以分為三個類型：
- 隨機英數字
  - 例如：日期、發票號碼
- Object ID
  - 須滿足特定格式 MongoDB 才接受
- 有意義的文本
  - 專案標題、專案說明

### 隨機英數字
這是最容易處理的部分，透過 `faker` 這個套件可以滿足大部分需求，只可惜他對中文的支援度不太夠，因此後續還有搭配其他套件 (e.g. `fake-data-generator-taiwan` 等) 來幫助產生。

### Object ID
一開始沒有想要納入這部分，但後面發現資料內容會互相關聯 (也或許有個好的設計)，因此需要再一開始就準備好所有 object ID，並規劃好 object ID 的規律。產生 object ID 只要使用 `mongoose` 本身的函數即可。
此外，object ID 也有儲存起來，下次隨機生成也會使用相同 object ID，未來更新資料時，可以只更新部分 collection 就好。

### 有意義的文本
有意義的文本沒版法用隨機的方式產生，因此需要依靠 chatGPT 來協助生成。
1. 先建立一個模板供 chatGPT 使用 (e.g. [這個檔案](./fakeData/dataSample.json))
2. 將結果整理並儲存 (e.g. [這個檔案](../src/db/data/data.json))

## 資料建立
1. 產生所有 object ID，並儲存 ([儲存位置](../src/db/data/objectId))
2. 讀取 chatGPT 產生的文本，作為基礎資料
3. 轉換成匯入 mongoDB 需要的格式，並加入隨機生成的內容，並儲存
   > - 某些欄位可以調整成非必要 (e.g. 網址)，基礎資料有該欄位時就使用，沒有的話就使用隨機或是原先訂好的規律，方便後續手動修改基礎資料
   > - 可以再後面添加額外參數，只針對特定檔案做儲存

## 資料匯入
### 作法
匯入的作法有幾個選擇
- 寫腳本 (e.g. playwright) 在前端匯入資料
  - 但前端還在調整中，不適合
- 打 API 匯入
  - 但資料會互相關聯，部分 API 需要 object ID
- 用 mongoose 匯入
  - 最終使用這個方法

### 流程
1. 連線資料庫 ([檔案位置](./src/connections/init.ts))
2. 依序把所有 collection 做更新