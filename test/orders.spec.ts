import { startServer } from "./startService";
import {
  expect,
  test,
  describe,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
} from "vitest";

import request from "supertest";

import { User, UserRole, LoginMethod } from "../src/model/userModels";
import Project from "../src/model/projectModels";
import Option from "../src/model/optionModels";
import UserProposer from "../src/model/userProposerModels";

import bcrypt from "bcryptjs";

import Order from "../src/model/orderModels";
import OrderInfo from "../src/model/orderInfoModels";

// ### setup express app
const app = startServer();

// ### setup test data
let newUser, newProject, newProposer, newOption1, newOption2;

const user_normal = {
  email: "user_order@test.com",
  pass: "12345678",
  login_method: [LoginMethod.NORMAL],
  user_roles: [UserRole.PROVIDER, UserRole.SUPPORTER],
  user_name: "user_order",
};
// UserProposer
const projectOwnerInfo = {
  proposer_name: "提案方 proposer - order",
  // proposer_create: "", // --> user
  proposer_email: "proposer_order@test.com",
  proposer_tax_id: "12345678",
};
const projectOption1 = {
  // option_parent: "", // --> project
  option_name: "方案 option1 - order",
  option_price: 1000,
  option_total: 100,
  option_content: "方案 option1 - order content",
  option_status: 2,
  option_start_date: new Date(),
  option_end_date: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
};
const projectOption2 = {
  // option_parent: "", // --> project
  option_name: "方案 option2 - order",
  option_price: 1000,
  option_total: 100,
  option_content: "方案 option2 - order content",
  option_status: 2,
  option_start_date: new Date(),
  option_end_date: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
};

const project = {
  project_title: "專案 project - order",
  project_summary: "專案 project summary",
  project_content: "專案 project content",
  project_category: "公益",
  project_target: 100000,
  project_progress: 0,
  project_status: 2,
  project_start_date: new Date(),
  project_end_date: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
  project_cover:
    "https://images.unsplash.com/photo-1533206482744-b9766a45e98a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80",
  project_risks: "專案 project risks",
  // ownerInfo: "", //--> UserProposer
  option: [], //--> projectOption1, projectOption2
};
// ### end setup test data ###

beforeAll(async () => {
  // User
  // UserProposer -> User
  // Project -> UserProposer
  //         -> Option
  // Option -> Project
  console.log("###### set up orders.spec test data");
  await User.deleteOne({ user_email: user_normal.email });

  newUser = await User.create({
    user_email: user_normal.email,
    user_hash_pwd: bcrypt.hashSync(user_normal.pass || "", 12),
    user_name: user_normal.user_name,
    user_roles: user_normal.user_roles,
    login_method: user_normal.login_method,
  });

  newProposer = await UserProposer.create(projectOwnerInfo);
  newProposer.proposer_create = newUser._id;
  await newProposer.save();

  newProject = await Project.create(project);
  newProject.ownerInfo = newProposer._id;

  newOption1 = await Option.create(projectOption1);
  newOption2 = await Option.create(projectOption2);
  newOption1.option_parent = newProject._id;
  newOption2.option_parent = newProject._id;
  await newOption1.save();
  await newOption2.save();

  newProject.option = [newOption1._id, newOption2._id];
  await newProject.save();
});

afterAll(async () => {
  console.log("###### clear up orders.spec test data");
  await User.deleteOne({ _id: newUser._id });
  await UserProposer.deleteOne({ _id: newProposer._id });
  await Option.deleteOne({ _id: newOption1._id });
  await Option.deleteOne({ _id: newOption2._id });
  await Project.deleteOne({ _id: newProject._id });
});

// #### tests ####
describe("orders", () => {
  let token: string;
  let orderId: string;
  let orderInfoId: string;

  async function createOrder() {
    // console.log("create order");
    const orderPayload = {
      user_id: newUser._id,
      project_id: newProject._id,
      option_id: newOption1._id,
      order_option_quantity: 1,
      order_extra: 0,
      order_total: 1000,
      order_note: "testing orders",
      payment_method: "信用卡",
      invoice_type: "紙本發票",
      invoice_carrier: "",
    };

    const res = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${token}`)
      .send(orderPayload);
    // console.log(JSON.stringify(res.body, null, 2));

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    orderId = res.body.data._id;
    orderInfoId = res.body.data.order_info;
    // update order_status =2
    const newOrder = await Order.findByIdAndUpdate(
      orderId,
      { order_status: 2 },
      { new: true }
    );
    expect(newOrder).not.toBeNull();
    expect(newOrder?.order_status).toEqual(2);
  }
  // signin
  beforeEach(async () => {
    const res = await request(app).post("/signin").send({
      email: user_normal.email,
      pass: user_normal.pass,
      method: user_normal.login_method[0],
      forget: false,
    });
    // console.log(res.body);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data.token.length).toBeGreaterThan(0);
    token = res.body.data.token;
    // console.log(token);
  });

  afterEach(async () => {
    await Order.deleteOne({ _id: orderId });
    await OrderInfo.deleteOne({ _id: orderInfoId });
  });

  test("make order", async () => {
    const orderPayload = {
      user_id: newUser._id,
      project_id: newProject._id,
      option_id: newOption1._id,
      order_option_quantity: 1,
      order_extra: 0,
      order_total: 1000,
      order_note: "testing orders",
      payment_method: "信用卡",
      invoice_type: "紙本發票",
      invoice_carrier: "",
    };

    const res = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${token}`)
      .send(orderPayload);
    // console.log(JSON.stringify(res.body, null, 2));

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data).toHaveProperty("_id");
    orderId = res.body.data._id;
    orderInfoId = res.body.data.order_info;
  });

  test("B10: get project's supporters", async () => {
    await createOrder();
    const res = await request(app)
      .get(`/owner/projects/${newProject._id}/supporters`)
      .set("Authorization", `Bearer ${token}`);
    // console.log(JSON.stringify(res.body, null, 2));

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data.length).toEqual(1);
    expect(res.body.data[0]).toHaveProperty("_id");
  });
});
