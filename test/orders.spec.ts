import {
  expect,
  test,
  describe,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
} from "vitest";
import express, { Request, Response, NextFunction } from "express";
import request from "supertest";
import createError from "http-errors";
import indexRouter from "../src/routes/index";
import "./src/connections";
import { User } from "../src/model/userModels";
import Project from "../src/model/projectModels";
import Option from "../src/model/optionModels";
import UserProposer from "../src/model/userProposerModels";

import bcrypt from "bcryptjs";

import Order from "../src/model/orderModels";
import OrderInfo from "../src/model/orderInfoModels";

// ### setup express app
const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);
// catch 404 (NOT FOUND) and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals = {}; // clear res.locals
  res.locals.ok = false;
  res.locals.msg = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {}; // NODE_ENV in .env file

  // render the error page
  res.status(err.status || 500);
  // console.log(res.locals);
  res.send(res.locals);
});
// ### end setup express app ###

beforeAll(async () => {
  await User.deleteOne({ user_email: user_normal.email });

  console.log("######clear up orders.spec test data");
  newUser = await User.create({
    user_email: user_normal.email,
    user_hash_pwd: bcrypt.hashSync(user_normal.pass || "", 12),
    user_name: "c1_12345678",
    user_role: [0],
    login_method: [0],
  });

  newProject = await Project.create(project);
  newProposer = await UserProposer.create(projectOwnerInfo);
  newProposer.proposer_create = newUser._id;

  newProject.ownerInfo = newProposer._id;

  newOption1 = await Option.create(projectOption1);
  newOption2 = await Option.create(projectOption2);
  // console.log("######setup test data", newProject);

  newOption1.option_parent = newProject._id;
  newOption2.option_parent = newProject._id;

  newProject.option = [newOption1._id, newOption2._id];
  await newProposer.save();
  await newProject.save();
  await newOption1.save();
  await newOption2.save();
});

afterAll(async () => {
  await User.deleteOne({ user_email: user_normal.email });

  await Project.deleteOne({ project_title: project.project_title });
  await UserProposer.deleteOne({
    proposer_name: projectOwnerInfo.proposer_name,
  });
  await Option.deleteOne({ option_name: projectOption1.option_name });
  await Option.deleteOne({ option_name: projectOption2.option_name });

  console.log("######clear up orders.spec test data");
});

// ### setup test data
let newUser, newProject, newProposer, newOption1, newOption2;

const user_normal = {
  email: "c_order@test.com",
  pass: "12345678",
  method: 0,
};
const projectOwnerInfo = {
  proposer_name: "test proposer name",
  // proposer_create: "", // --> user
  proposer_email: "abc@proposer.com",
  proposer_tax_id: "12345678",
};
const projectOption1 = {
  // option_parent: "", // --> project
  option_name: "test option name 1",
  option_price: 1000,
  option_total: 100,
  option_content: "test option content 1",
  option_status: 2,
  option_start_date: new Date(),
  option_end_date: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
};
const projectOption2 = {
  // option_parent: "", // --> project
  option_name: "test option name 2",
  option_price: 1000,
  option_total: 100,
  option_content: "test option content 2",
  option_status: 2,
  option_start_date: new Date(),
  option_end_date: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
};

const project = {
  project_title: "test project",
  project_summary: "test project summary",
  project_content: "test project content",
  project_category: "公益",
  project_target: 100000,
  project_progress: 0,
  project_status: 2,
  project_start_date: new Date(),
  project_end_date: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
  project_cover:
    "https://images.unsplash.com/photo-1533206482744-b9766a45e98a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80",
  project_risks: "test project risks",
  // ownerInfo: "", //--> projectOwnerInfo
  option: [], //--> projectOption1, projectOption2
};
// ### end setup test data ###

describe("orders", () => {
  let token: string;
  let orderId: string;
  let orderInfoId: string;

  // signin
  beforeEach(async () => {
    const res = await request(app).post("/signin").send(user_normal);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data.token.length).toBeGreaterThan(0);
    token = res.body.data.token;
    console.log(token);
  });

  afterEach(async () => {
    await Order.deleteOne({ _id: orderId });
    await OrderInfo.deleteOne({ _id: orderInfoId });
  });

  test("make order", async () => {
    const testPayload = {
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
    // console.log(JSON.stringify(testPayload, null, 2));

    const res = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${token}`)
      .send(testPayload);
    // console.log(JSON.stringify(res.body, null, 2));
    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data).toHaveProperty("_id");
    orderId = res.body.data._id;
    orderInfoId = res.body.data.order_info;
  });
});
