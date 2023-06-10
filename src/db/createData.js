const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { zh_TW, fakerZH_TW } = require('@faker-js/faker');
const FakeDataGenerator = require('fake-data-generator-taiwan');
const bcrypt = require("bcryptjs");
const fs = require('fs');

class DataGenerator {
  constructor(
    nUser,
    nProposer,
    nProjectPerProposer,
    nOptionPerProject,
    nQasPerProject,
    nNewsPerProject,
    nOrderPerUser,
    nLikePerUser,
    proposerNames,
    data
  ) {
    this.nUser = nUser,
    this.nProposer = nProposer,
    this.nProjectPerProposer = nProjectPerProposer,
    this.nOptionPerProject = nOptionPerProject,
    this.nQasPerProject = nQasPerProject,
    this.nNewsPerProject = nNewsPerProject,
    this.nOrderPerUser = nOrderPerUser,
    this.nLikePerUser = nLikePerUser,
    this.nProject = nProposer * nProjectPerProposer,
    this.nOption = this.nProject * nOptionPerProject,
    this.nQas = this.nProject * nQasPerProject,
    this.nNews = this.nProject * nNewsPerProject,
    this.nOrder = nUser * nOrderPerUser,
    this.nLike = nUser * nLikePerUser,
    this.userIds = [],
    this.proposerIds = [],
    this.projectIds = [],
    this.optionIds = [],
    this.qasIds = [],
    this.newsIds = [],
    this.orderIds = [],
    this.orderInfoIds = [],
    this.likeIds = [],
    this.users = [],
    this.proposers = [],
    this.projects = [],
    this.options = [],
    this.qas = [],
    this.news = [],
    this.orders = [],
    this.orderInfos = [],
    this.likes = [],
    this.categories = ["校園", "公益", "市集"], 
    this.tags = ["hot", "recent", "long"],
    this.paymentMethod = ["WEBATM", "CREDIT"],
    this.invoiceType = ["紙本發票", "電子載具", "三聯式發票"],
    this.proposerNames = proposerNames,
    this.data = data
  }

  generateObjectIds(array, n) {
    for (let i = 0; i < n; i++) {
      const id = new mongoose.Types.ObjectId().toString();
      array.push(id);
    };
    return array;
  }

  generateAllObjectIds() {
    this.userIds = this.generateObjectIds(this.userIds, this.nUser);
    this.proposerIds = this.generateObjectIds(this.proposerIds, this.nProposer);
    this.projectIds = this.generateObjectIds(this.projectIds, this.nProject);
    this.optionIds = this.generateObjectIds(this.optionIds, this.nOption);
    this.qasIds = this.generateObjectIds(this.qasIds, this.nQas);
    this.newsIds = this.generateObjectIds(this.newsIds, this.nNews);
    this.orderIds = this.generateObjectIds(this.orderIds, this.nOrder);
    this.orderInfoIds = this.generateObjectIds(this.orderInfoIds, this.nOrder);
    this.likeIds = this.generateObjectIds(this.likeIds, this.nLike);
    console.log("All object IDs are created");

    fs.writeFileSync('src/db/data/objectId/userIds.json', JSON.stringify(this.userIds, null, 4));
    fs.writeFileSync('src/db/data/objectId/proposerIds.json', JSON.stringify(this.proposerIds, null, 4));
    fs.writeFileSync('src/db/data/objectId/projectIds.json', JSON.stringify(this.projectIds, null, 4));
    fs.writeFileSync('src/db/data/objectId/optionIds.json', JSON.stringify(this.optionIds, null, 4));
    fs.writeFileSync('src/db/data/objectId/qasIds.json', JSON.stringify(this.qasIds, null, 4));
    fs.writeFileSync('src/db/data/objectId/newsIds.json', JSON.stringify(this.newsIds, null, 4));
    fs.writeFileSync('src/db/data/objectId/orderIds.json', JSON.stringify(this.orderIds, null, 4));
    fs.writeFileSync('src/db/data/objectId/orderInfoIds.json', JSON.stringify(this.orderInfoIds, null, 4));
    fs.writeFileSync('src/db/data/objectId/likeIds.json', JSON.stringify(this.likeIds, null, 4));
    console.log("All object IDs are saved");
  }

  readAllObjectIds() {
    this.userIds = JSON.parse(fs.readFileSync("./src/db/data/objectId/userIds.json", "utf-8"));
    this.proposerIds = JSON.parse(fs.readFileSync("./src/db/data/objectId/proposerIds.json", "utf-8"));
    this.projectIds = JSON.parse(fs.readFileSync("./src/db/data/objectId/projectIds.json", "utf-8"));
    this.optionIds = JSON.parse(fs.readFileSync("./src/db/data/objectId/optionIds.json", "utf-8"));
    this.qasIds = JSON.parse(fs.readFileSync("./src/db/data/objectId/qasIds.json", "utf-8"));
    this.newsIds = JSON.parse(fs.readFileSync("./src/db/data/objectId/newsIds.json", "utf-8"));
    this.orderIds = JSON.parse(fs.readFileSync("./src/db/data/objectId/orderIds.json", "utf-8"));
    this.orderInfoIds = JSON.parse(fs.readFileSync("./src/db/data/objectId/orderInfoIds.json", "utf-8"));
    this.likeIds = JSON.parse(fs.readFileSync("./src/db/data/objectId/likeIds.json", "utf-8"));
    console.log("All object IDs are imported");
  }

  createRandomUsers() {
    let generator = new FakeDataGenerator();
    const users = [];
    for (let i = 0; i < this.nUser; i++) {
      const firstname = faker.person.firstName();
      const lastname = faker.person.lastName();

      const userId = this.userIds[i];

      const user = {
        _id: userId,
        // user_name: `${firstname} ${lastname}`,
        user_name: generator.Name.generate(),
        user_email: faker.internet.email({ firstName: firstname, lastName: lastname }),
        user_hash_pwd: bcrypt.hashSync("password", 12),
        user_roles: i < this.nProposer ? [0, 2] : [0],
        login_method: [0],
        oauth_google_id: "",
        user_create_date: faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2023-01-01T00:00:00.000Z' }).toJSON(),
        user_update_date: faker.date.between({ from: '2023-04-01T00:00:00.000Z', to: '2023-05-28T00:00:00.000Z' }).toJSON(),
        user_cover: "cover URL",
        // user_phone: faker.phone.number("09##-###-###"),
        user_phone: generator.Mobile.generate(0, 10),
        user_intro: "user intro",
        user_website: "website",
        user_interests: [],
        user_like: []  // TODO
      }
      users.push(user);
    };
    this.users = users;
    console.log(`${this.nUser} random users are created`);
  }

  createRandomProposers() {
    let generator = new FakeDataGenerator();
    const proposers = [];
    const step = this.nProjectPerProposer;
    for (let i = 0; i < this.nProposer; i++) {
      // const companyName = faker.company.name();
      const companyName = this.proposerNames[i];
      
      const userId = this.userIds[i];
      const proposerId = this.proposerIds[i];

      const proposer = {
        _id: proposerId,
        proposer_name: companyName,
        proposer_create: userId,
        proposer_group: [],
        proposer_create_date: faker.date.between({ from: '2023-01-02T00:00:00.000Z', to: '2023-03-31T00:00:00.000Z' }).toJSON(),
        proposer_update_date: faker.date.between({ from: '2023-04-01T00:00:00.000Z', to: '2023-06-30T00:00:00.000Z' }).toJSON(),
        proposer_email: faker.internet.email({ firstName: companyName }),
        user_phone: generator.Mobile.generate(0, 10),
        proposer_tax_id: faker.string.numeric(8),
        proposer_intro: "proposer intro",
        proposer_website: "proposer website",
        proposer_project: this.projectIds.slice(i * step, (i + 1) * step),
        proposer_like: [],
      }
      proposers.push(proposer);
    };
    this.proposers = proposers;
    console.log(`${this.nProposer} random proposers are created`);
  }

  createRandomProjects() {
    const projects = [];
    const optionStep = this.nOptionPerProject;
    const qasStep = this.nQasPerProject;
    const newsStep = this.nNewsPerProject;
    const orderStep = this.nOrderPerUser;
    for (let i = 0; i < this.nProject; i++) {
      const startDate = faker.date.between({ from: '2023-03-15T00:00:00.000Z', to: '2023-06-30T00:00:00.000Z' });
      const endDate = new Date(startDate.setMonth(startDate.getMonth() + 3))
      const category = this.categories[i % 3];
      const tag = this.tags[faker.number.int({ min: 0, max: 2 })];

      const projectId = this.projectIds[i];
      const userId = this.userIds[i];

      const r = i % this.nProjectPerProposer;
      const q = (i - r) / this.nProjectPerProposer;
      const proposerId = this.proposerIds[Math.round(q)];

      const defaultCoverUrl = "https://storage.googleapis.com/rabbitfund01.appspot.com/images/ff11bb06-dc05-4c78-9434-999ec4b5934f.png?GoogleAccessId=firebase-adminsdk-1xnh8%40rabbitfund01.iam.gserviceaccount.com&Expires=16756646400&Signature=Qtzv3muBlIjuBx0yGdnU6JnVePxD8OR3fYa9NAaZog5GQ3k7BksO%2FTKZXe3l5YB3UCNkR4mg7PDB5D%2FsyB428Wwc%2BnmJudpvxiNVrYv8ZPDGSKGAS876Di5eFy3i0fmIgaD%2BPSOl%2FPfkaOhyPUdjCMHfW0fKNntP%2Ft9eTx23SMue%2BbP2RWMAVoXzYOFllBJPqWHX%2BCCG4ctF0ZFKTEVT4h625VapPUtofQI4imkrQA6c4r4w8%2BclWczK%2FakWmTdr%2BRiLEonD0Kx3oHMXy0X4UlQJnIYr5IIpTwFWJwZCmBlEzI0jX2tfk3r6Y4S9ivW9dEt0h6lTM8SEexjNshoD8A%3D%3D";
      const defaultVideoUrl = "https://www.youtube.com/watch?v=uncWs5w6aVg"

      const project = {
        _id: projectId,
        project_title: this.data[i] ? this.data[i].title : `標題 ${i} ${projectId}`,
        project_summary: this.data[i] ? this.data[i].summary : "summary",
        project_content: this.data[i] ? this.data[i].content : "project content",
        project_category: (!this.data[i]) ? category : (!this.data[i].category) ? category : this.data[i].category,
        project_target: this.data[i] ? this.data[i].target : faker.number.int({ min: 1, max: 300 }) * 10000,
        project_progress: faker.number.int({ min: 1, max: 500 }) * 10000,
        project_status: 2,
        project_start_date: startDate.toJSON(),
        project_end_date: endDate.toJSON(),
        project_create_date: faker.date.between({ from: '2023-01-02T00:00:00.000Z', to: '2023-03-31T00:00:00.000Z' }).toJSON(),
        project_update_date: faker.date.between({ from: '2023-04-01T00:00:00.000Z', to: '2023-06-30T00:00:00.000Z' }).toJSON(),
        project_update_final_member: userId,
        project_cover: (!this.data[i]) ? defaultCoverUrl : (!this.data[i].cover) ? defaultCoverUrl : this.data[i].cover,
        project_video: (!this.data[i]) ? defaultVideoUrl : (!this.data[i].video) ? defaultVideoUrl : this.data[i].video,
        project_risks: this.data[i] ? this.data[i].risks : "project risks",
        project_tag: this.data[i] ? this.data[i].tag : tag,
        ownerInfo: proposerId,
        option: this.optionIds.slice(i * optionStep, (i + 1) * optionStep),
        news: this.newsIds.slice(i * newsStep, (i + 1) * newsStep),
        qas: this.qasIds.slice(i * qasStep, (i + 1) * qasStep),
        order: this.orderIds.slice(i * orderStep, (i + 1) * orderStep),
        delete: false,
        delete_member: null,
      }
      projects.push(project);
    };
    this.projects = projects;
    console.log(`${this.nProject} random projects are created`);
  }

  createRandomOptions() {
    const options = [];

    for (let i = 0; i < this.nOption; i++) {
      const r = i % this.nOptionPerProject;
      const q = (i - r) / this.nOptionPerProject;
      const projectIdx = Math.round(q);
      const projectId = this.projectIds[projectIdx];
      const optionId = this.optionIds[i];

      const option = {
        _id: optionId,
        option_parent: projectId,
        option_name: this.data[projectIdx] ? this.data[projectIdx].option[i % 3].name : "option name",
        option_price: this.data[projectIdx] ? this.data[projectIdx].option[i % 3].price : faker.number.int({ min: 1, max: 500 }) * 100,
        option_total: this.data[projectIdx] ? this.data[projectIdx].option[i % 3].total : faker.number.int({ min: 50, max: 500 }),
        option_content: this.data[projectIdx] ? this.data[projectIdx].option[i % 3].content : "option content",
        option_cover: "cover URL",
        option_status: 2,
        option_start_date: faker.date.between({ from: '2023-04-01T00:00:00.000Z', to: '2023-05-31T00:00:00.000Z' }).toJSON(),
        option_end_date: faker.date.between({ from: '2023-06-01T00:00:00.000Z', to: '2023-08-31T00:00:00.000Z' }).toJSON(),
        option_create_date: faker.date.between({ from: '2023-01-02T00:00:00.000Z', to: '2023-03-31T00:00:00.000Z' }).toJSON(),
        option_update_date: faker.date.between({ from: '2023-04-01T00:00:00.000Z', to: '2023-06-30T00:00:00.000Z' }).toJSON(),
        delete: false,
        delete_member: null,
      }
      options.push(option);
    };
    this.options = options;
    console.log(`${this.nOption} random options are created`);
  }

  createRandomQas() {
    const qas = [];

    for (let i = 0; i < this.nQas; i++) {
      const r = i % this.nQasPerProject;
      const q = (i - r) / this.nQasPerProject;
      const projectIdx = Math.round(q);
      const projectId = this.projectIds[projectIdx];
      const qaId = this.qasIds[i];

      const qa = {
        _id: qaId,
        qas_parent: projectId,
        qas_q: this.data[projectIdx] ? this.data[projectIdx].qas[i % 2].qas_q : "question",
        qas_a: this.data[projectIdx] ? this.data[projectIdx].qas[i % 2].qas_a : "answer",
        qas_create_date: faker.date.between({ from: '2023-01-02T00:00:00.000Z', to: '2023-03-31T00:00:00.000Z' }).toJSON(),
        qas_update_date: faker.date.between({ from: '2023-04-01T00:00:00.000Z', to: '2023-06-30T00:00:00.000Z' }).toJSON(),
        check: true,
        enables: true
      }
      qas.push(qa);
    };
    this.qas = qas;
    console.log(`${this.nQas} random QAs are created`);
  }

  createRandomNews() {
    const news = [];

    for (let i = 0; i < this.nNews; i++) {
      const r = i % this.nNewsPerProject;
      const q = (i - r) / this.nNewsPerProject;
      const projectIdx = Math.round(q);
      const projectId = this.projectIds[projectIdx];
      const newsId = this.newsIds[i];

      const item = {
        _id: newsId,
        news_parent: projectId,
        news_title: this.data[projectIdx] ? this.data[projectIdx].news[i % 2].news_title : "news title",
        news_content: this.data[projectIdx] ? this.data[projectIdx].news[i % 2].news_content : "news content",
        news_cover: "news cover URL",
        news_status: 2,
        news_start_date: faker.date.between({ from: '2023-04-01T00:00:00.000Z', to: '2023-04-30T00:00:00.000Z' }).toJSON(),
        news_end_date: faker.date.between({ from: '2023-08-15T00:00:00.000Z', to: '2023-09-30T00:00:00.000Z' }).toJSON(),
        news_create_date: faker.date.between({ from: '2023-01-02T00:00:00.000Z', to: '2023-03-31T00:00:00.000Z' }).toJSON(),
        news_update_date: faker.date.between({ from: '2023-04-01T00:00:00.000Z', to: '2023-06-30T00:00:00.000Z' }).toJSON(),
        check: true,
        enables: true
      }
      news.push(item);
    };
    this.news = news;
    console.log(`${this.nNews} random news are created`);
  }

  createRandomOrders() {
    const orders = [];
    // 0, 10, 20, .., 90 號訂單都是 0 號使用者
    // 1, 11, 21, .., 91 號訂單都是 1 號使用者
    // 100, 110, 120, ..., 190 則是 10 號
    // 200, 210 則是 20 號
    // % 10 的餘數決定幾號，百位數字決定要加幾個 10

    for (let i = 0; i < this.nOrder; i++) {
      const r1 = i % (this.nOrderPerUser ** 2);
      const q1 = (i - r1) / (this.nOrderPerUser ** 2);
      const group = Math.round(q1);
      const userIdx = i % this.nOrderPerUser + group * this.nOrderPerUser
      const userId = this.userIds[userIdx];

      const r2 = i % this.nProposer;
      const q2 = (i - r2) / this.nProposer;
      const proposerId = this.proposerIds[Math.round(q2)];

      const r3 = i % this.nOrderPerUser;
      const q3 = (i - r3) / this.nOrderPerUser;
      const projectId = this.projectIds[Math.round(q3)];

      const selectOption = faker.number.int({ min: 0, max: 2 });
      const optionId = this.optionIds[Math.round(q3) + selectOption];

      const orderId = this.orderIds[i];
      const orderInfoId = this.orderInfoIds[i];

      const quantity = faker.number.int({ min: 1, max: 5 });
      const extra = faker.number.int({ min: 1, max: 50 }) * 100;
      const optionPrice = this.options[Math.round(q3) + selectOption].option_price;
      const totalPrice = optionPrice * quantity + extra;

      const order = {
        _id: orderId,
        user: userId,
        ownerInfo: proposerId,
        project: projectId,
        option: optionId,
        order_option_quantity: quantity,
        order_extra: extra,
        order_total: totalPrice,
        order_note: "order note",
        order_create_date: faker.date.between({ from: '2023-04-01T00:00:00.000Z', to: '2023-06-30T00:00:00.000Z' }).toJSON(),
        order_status: 2,
        order_shipping_status: 0,
        order_shipping_date: faker.date.between({ from: '2023-08-01T00:00:00.000Z', to: '2023-12-31T00:00:00.000Z' }).toJSON(),
        order_final_date: faker.date.between({ from: '2023-07-01T00:00:00.000Z', to: '2023-07-31T00:00:00.000Z' }).toJSON(),
        order_feedback: "order feedback",
        order_info: orderInfoId,
      }
      orders.push(order);
    };
    this.orders = orders;
    console.log(`${this.nOrder} random orders are created`);
  }

  createRandomOrderInfos() {
    const orderInfos = [];

    for (let i = 0; i < this.nOrder; i++) {
      const orderInfoId = this.orderInfoIds[i];
      const userId = this.orders[i].user;
      const price = this.orders[i].order_total
      const paymentMethod = this.paymentMethod[i % 2];
      const paymentDate = faker.date.between({ from: '2023-06-01T00:00:00.000Z', to: '2023-06-30T00:00:00.000Z' });
      const invoiceNumber_1 = faker.string.alpha({length: 3, casing: "upper"});
      const invoiceNumber_2 = faker.string.numeric(8)
      const invoiceType = this.invoiceType[i % 3];
      const invoiceCarrier = i % 3 === 1 ? `/${faker.string.alphanumeric({length: 7, casing: "upper"})}` : ""
      const newebpayPayTime = paymentDate.toJSON().substring(0, 19).replace("T", "")

      const orderInfo = {
        _id: orderInfoId,
        user: userId,
        payment_price: price,
        payment_method: paymentMethod,
        payment_status: 2,
        invoice_number: `${invoiceNumber_1}-${invoiceNumber_2}`,
        invoice_date: paymentDate.toJSON(),
        invoice_type: invoiceType,
        invoice_carrier: invoiceCarrier,
        newebpay_timeStamp: Math.round(paymentDate.getTime() / 1000), // NOTE: 藍新金流有限制時間戳長度 10 位數
        newebpay_aes_encrypt: "13b7fa9fd92305551393f96554ad5e0e9f16d80baf2b83d045d93ce6e738619b2a90457e105fc8ea8116effe6b4152214f89f046a2bb46346f6d33d7bc5fee9898041527c39c42f7eeee325ffe72e243d93043dd26ff102881266769ae6f32a3d0c90cd79d09407faf418098b44675a263740b2dd6bb83a4211633df03099629a5fd05c9467936326047ab87c885e23d919528c323642cb27903b7b664d4f07b595b8046f4547452da468b6ee900d18038e04d4c205b1dee0f78a63ed96ee389a59a496c172ef10de96f2f90526b88e1a06c1a1170e5931e8d46276a711825fd52f8eb16216cbd48e3a4851330a9c821",
        newebpay_sha_encrypt: "630B88DFFB5C34239AF78463AF108F34AF78243D8C98A08758C2C45815501C5A",
        newebpay_tradeNo: "23060200514650996",
        newebpay_IP: faker.internet.ipv4(),
        newebpay_escrowBank: "809",
        newebpay_payBankCode: "809",
        newebpay_payerAccount5Code: faker.string.numeric(5),
        newebpay_payTime: newebpayPayTime
      }
      orderInfos.push(orderInfo);
    };
    this.orderInfos = orderInfos;
    console.log(`${this.nOrder} random orderInfos are created`);
  }

  createRandomLikes() {
    const likes = [];

    for (let i = 0; i < this.nLike; i++) {
      const likeId = this.likeIds[i];
      const r = i % this.nLikePerUser;
      const q = (i - r) / this.nLikePerUser;
      const userId = this.userIds[Math.round(q)];
      const projectIdx = faker.number.int({ min: 0, max: this.nProject - 1 })
      const projectId = this.projectIds[projectIdx]

      const like = {
        _id: likeId,
        user: userId,
        project: projectId,
        created: faker.date.between({ from: '2023-04-01T00:00:00.000Z', to: '2023-06-30T00:00:00.000Z' }).toJSON(),
      }
      likes.push(like);
    };
    this.likes = likes;
    console.log(`${this.nLike} random likes are created`);
  }

  createAllRandomData() {
    this.createRandomUsers()
    this.createRandomProposers()
    this.createRandomProjects()
    this.createRandomOptions()
    this.createRandomQas()
    this.createRandomNews()
    this.createRandomOrders()
    this.createRandomOrderInfos()
    this.createRandomLikes()
  }

  writeFiles() {
    fs.writeFileSync('src/db/data/users.json', JSON.stringify(this.users, null, 4));
    fs.writeFileSync('src/db/data/proposers.json', JSON.stringify(this.proposers, null, 4));
    fs.writeFileSync('src/db/data/projects.json', JSON.stringify(this.projects, null, 4));
    fs.writeFileSync('src/db/data/options.json', JSON.stringify(this.options, null, 4));
    fs.writeFileSync('src/db/data/qas.json', JSON.stringify(this.qas, null, 4));
    fs.writeFileSync('src/db/data/news.json', JSON.stringify(this.news, null, 4));
    fs.writeFileSync('src/db/data/orders.json', JSON.stringify(this.orders, null, 4));
    fs.writeFileSync('src/db/data/orderInfos.json', JSON.stringify(this.orderInfos, null, 4));
    fs.writeFileSync('src/db/data/likes.json', JSON.stringify(this.likes, null, 4));

    console.log("All json files are created")
  }
}

const proposerNames = JSON.parse(fs.readFileSync("./src/db/data/proposer_name.json", "utf-8"));
const data = JSON.parse(fs.readFileSync("./src/db/data/data.json", "utf-8"));

const nUser = 40;
const nProposer = 20;
const nProjectPerProposer = 2;
const nOptionPerProject = 3;
const nQasPerProject = 2;
const nNewsPerProject = 2;
const nOrderPerUser = 10;   // (10個不同專案)
const nLikePerUser = 3;

// 共 40 個專案
// 共 400 筆訂單，每個使用者選 10 個專案
// 訂單順序 = 
// 1 號使用者選 1 號專案，
// 2 號使用者選 1 號專案，
// ...
// 10 號使用者選 1 號專案，
// 1 號使用者選 2 號專案，
// ...
// 前 10 號使用者只贊助前 10 號專案

const dataGen = new DataGenerator(
  nUser,
  nProposer,
  nProjectPerProposer,
  nOptionPerProject,
  nQasPerProject,
  nNewsPerProject,
  nOrderPerUser,   // (10個不同專案)
  nLikePerUser,
  proposerNames,
  data
)

// dataGen.generateAllObjectIds()
dataGen.readAllObjectIds()

dataGen.createAllRandomData()

dataGen.writeFiles()
