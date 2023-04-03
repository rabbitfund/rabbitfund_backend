# rabbitfund_backend
## 使用方法
### 開發
```
concurrently 'tsc -w' 'nodemon ./bin/www'
```

## 建置流程

### 0. 新增基本檔案
   - `.gitignore`
   - `README.md`

### 1. 用 express generator 建立基本檔案
```
npx express-generator
```

### 2. Typescript
1. 新增資料夾 `src` 與 `src/routes`
2. 新增 `.ts` 檔案們
3. 新增 `tsconfig.json`，重點設定為：
   - `"include": ["src/"]`
   - `"outDir": "dist"`

### 3. 修改 `www`
- 將 `app.js` 的路徑做修正，改成 typescript 編譯完的檔案路徑
  ```
  var app = require('../dist/app');
  ```

