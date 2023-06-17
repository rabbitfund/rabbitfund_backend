# 建置流程
## 0. 新增基本檔案
   - `.gitignore`
   - `README.md`

## 1. 用 express generator 建立基本檔案
```
npx express-generator
```

## 2. Typescript
1. 新增資料夾 `src` 與 `src/routes`
2. 新增 `.ts` 檔案們
3. 新增 `tsconfig.json`，重點設定為：
   - `"include": ["src/"]`
   - `"outDir": "dist"`

## 3. 修改 `www`
- 將 `app.js` 的路徑做修正，改成 typescript 編譯完的檔案路徑
  ```js
  var app = require('../dist/app');
  ```

## 4. MongoDB
- 安裝 Mongoose 與 dotenv 套件
  ```
  npm install mongoose dotenv
  ```
- 新增 `src/connections` 資料夾，以及 `src/connections/index.ts`
  > 由於 typescript 不認識 `process.env`，因此需要額外去設定，[查到的做法](https://stackoverflow.com/questions/45194598/using-process-env-in-typescript)大致有兩種：
  > - 在 `.d.ts` 檔設定 global 的 interface (在此專案為 `environment.d.ts`)
  > - 在 `process.env` 程式碼之前添加
  >   ```
  >   declare var process : {
  >     env: {
  >       DATABASE_PASSWORD: string
  >     }
  >   }
  >   ```
- 新增 `.env` 與 `example.env`，並把 `.env` 加入 `.gitignore`
- 在 `app.ts` 引入 `connections/index.ts`
  ```js
  import './connections'
  ```

## 5. 調整架構
- 在 `src/model` 資料夾加入 MongoDB 的 Model
  > 在此先用教學範例 `post.ts`
- 在 `src/controllers` 和 `src/routes` 資料夾新增管理 `Post` Model 的檔案
- 在 `src/service` 新增成功處理與錯誤處理 (`handleSuccess.ts`、`handleError.ts`)
- 在 `app.ts` 引入上述新增的 `posts` 路由

## 6. Vitest
- 安裝 Vitest 套件
  ```
  npm install --save-dev vitest @vitest/coverage-c8 supertest @types/supertest 
  ```
  > - `@vitest/coverage-c8` 是用來計算測試覆蓋率的
  > - `supertest` 是用到來測試 API 的
- 新增 Vitest 設定檔 `vitest.config.ts`
- 把 `/coverage` 資料夾加入 `.gitignore`
- 新增測試檔 (`.spec.ts`) 到 `test` 資料夾

## 7. Github Actions
- 在 `.github/workflows` 資料夾建立 `.yml` 檔
- 新增 badge ([官方文件](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge))

## 8. Swagger
一共有兩個版本，分別是：
- `swagger-autogen`
  - 會根據 router 的程式碼，產生對應文件
  - 優點：
    - 容易設定 API 分類
  - 缺點：
    - 詳細內容要手動新增
- `postman-to-openapi`
  - 會根據 postman 輸出的 `.json`，產生對應的文件
  - 優點：
    - 詳細內容也會一併產生
  - 缺點：
    - postman 內無法設定到的部分就無法處理 (e.g. 分類)

### swagger-autogen

### postman-to-openapi