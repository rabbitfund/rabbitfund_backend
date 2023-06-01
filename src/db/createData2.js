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
    console.log("All object IDs are created")
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
    console.log(`${this.nUser} random users are created`)
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
    console.log(`${this.nProposer} random proposers are created`)
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
    console.log(`${this.nProject} random projects are created`)
  }

  writeFiles() {
    fs.writeFileSync('src/db/data/user.json', JSON.stringify(this.users, null, 4));
    fs.writeFileSync('src/db/data/proposer.json', JSON.stringify(this.proposers, null, 4));
    fs.writeFileSync('src/db/data/project.json', JSON.stringify(this.projects, null, 4));

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
console.log(data.projects.length)
// console.log(data.projects[0])
// console.log(data.projects[1])

data.writeFiles()
