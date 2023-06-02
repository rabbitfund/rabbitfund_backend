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
    nLikePerUser
  ) {
    this.nUser = nUser,
    this.nProposer = nProposer,
    this.nProjectPerProposer = nProjectPerProposer,
    this.nOptionPerProject = nOptionPerProject,
    this.nQasPerProject = nQasPerProject,
    this.nNewsPerProject = nNewsPerProject,
    this.nOrderPerUser = nOrderPerUser,
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
    this.tags = ["hot", "recent", "long"]
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
        user_roles: [0],
        login_method: [0],
        oauth_google_id: "",
        user_create_date: faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2023-01-01T00:00:00.000Z' }).toJSON(),
        user_update_date: faker.date.between({ from: '2023-04-01T00:00:00.000Z', to: '2023-05-28T00:00:00.000Z' }).toJSON(),
        user_cover: "cover URL",
        // user_phone: faker.phone.number("09##-###-###"),
        user_phone: generator.Mobile.generate(0, 10),
        user_intro: "user intro",
        user_website: "website",
        user_interests: []
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
      const companyName = faker.company.name();
      
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

      const userId = this.userIds[i];
      const proposerId = this.proposerIds[i];
      const projectId = this.projectIds[i];

      const project = {
        _id: projectId,
        project_title: `標題 ${i} ${projectId}`,
        project_summary: "summary",
        project_content: "project content",
        project_category: category,
        project_target: faker.number.int({ min: 1, max: 300 }) * 10000,
        project_progress: faker.number.int({ min: 1, max: 500 }) * 10000,
        project_status: 2,
        project_start_date: startDate.toJSON(),
        project_end_date: endDate.toJSON(),
        project_create_date: faker.date.between({ from: '2023-01-02T00:00:00.000Z', to: '2023-03-31T00:00:00.000Z' }).toJSON(),
        project_update_date: faker.date.between({ from: '2023-04-01T00:00:00.000Z', to: '2023-06-30T00:00:00.000Z' }).toJSON(),
        project_update_final_member: userId,
        project_cover: "project cover",
        project_video: "project video",
        project_risks: "project risks",
        project_tag: tag,
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
      const projectId = this.projectIds[Math.round(q)];
      const optionId = this.optionIds[i];

      const option = {
        _id: optionId,
        option_parent: projectId,
        option_name: "option name",
        option_price: faker.number.int({ min: 1, max: 500 }) * 100,
        option_total: faker.number.int({ min: 50, max: 500 }),
        option_content: "option content",
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
      const projectId = this.projectIds[Math.round(q)];
      const qaId = this.qasIds[i];

      const qa = {
        _id: qaId,
        qas_parent: projectId,
        qas_q: "question",
        qas_a: "answer",
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
      const projectId = this.projectIds[Math.round(q)];
      const newsId = this.newsIds[i];

      const item = {
        _id: newsId,
        news_parent: projectId,
        news_title: "question",
        news_content: "answer",
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
      const userNum = i % this.nOrderPerUser + group * this.nOrderPerUser
      const userId = this.userIds[userNum];

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
        order_info: orderInfoId,
      }
      orders.push(order);
    };
    this.orders = orders;
    console.log(`${this.nOrder} random orders are created`);
  }

  writeFiles() {
    fs.writeFileSync('src/db/data/user.json', JSON.stringify(this.users, null, 4));
    fs.writeFileSync('src/db/data/proposer.json', JSON.stringify(this.proposers, null, 4));
    fs.writeFileSync('src/db/data/project.json', JSON.stringify(this.projects, null, 4));
    fs.writeFileSync('src/db/data/option.json', JSON.stringify(this.options, null, 4));
    fs.writeFileSync('src/db/data/qas.json', JSON.stringify(this.qas, null, 4));
    fs.writeFileSync('src/db/data/news.json', JSON.stringify(this.news, null, 4));
    fs.writeFileSync('src/db/data/orders.json', JSON.stringify(this.news, null, 4));

    console.log("All json files are created")
  }
}



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

const data = new DataGenerator(
  nUser,
  nProposer,
  nProjectPerProposer,
  nOptionPerProject,
  nQasPerProject,
  nNewsPerProject,
  nOrderPerUser,   // (10個不同專案)
  nLikePerUser,
)

data.generateAllObjectIds()

data.createRandomUsers()
data.createRandomProposers()
data.createRandomProjects()
data.createRandomOptions()
data.createRandomQas()
data.createRandomOrders()
// console.log(data.orders[0])
// console.log(data.orders[1])

data.writeFiles()
