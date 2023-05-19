import dotenv from 'dotenv';
import swaggerAutogen from 'swagger-autogen';

dotenv.config({ path: "./.env" });

const host = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://rabbitfund-backend.onrender.com';

// const doc = {
//   info: {
//     title: '寵知 API',
//     version: '1.0.0',
//     description: 'API 文件',
//   },
//   host: host,
//   schemes: ['http', 'https'],
//   securityDefinitions: {
//     apiKeyAuth: {
//       type: 'apiKey',
//       in: 'headers',
//       name: 'authorization',
//       description: '請加上 API Token',
//     },
//   }, // 對應 PostController.deletePost
// };

const doc = {
  info: {
      "version": "0.1.0",
      "title": "倍而兔募資平台 API",
      "description": ""
  },
  host: host,
  // basePath: "",                     // by default: "/"
  // schemes: [],                      // by default: ['http']
  // consumes: [],                     // by default: ['application/json']
  // produces: [],                     // by default: ['application/json']
  // tags: [
  //   {
  //     "name": "Index",
  //     "description": ""
  //   },
  //   {
  //     "name": "User",
  //     "description": ""
  //   },
  //   {
  //     "name": "Project",
  //     "description": ""
  //   },
  //   {
  //     "name": "Order",
  //     "description": ""
  //   },
  //   {
  //     "name": "Image",
  //     "description": ""
  //   },
  // ],
  // securityDefinitions: { },         // by default: empty object
  // definitions: { }                  // by default: empty object
}

const outputFile = './swagger_output.json'; // 輸出的文件名稱
const endpointsFiles = ['./src/app.ts']; // 要指向的 API，通常使用 Express 直接指向到 app.js 就可以

swaggerAutogen(outputFile, endpointsFiles, doc); // swaggerAutogen 的方法
