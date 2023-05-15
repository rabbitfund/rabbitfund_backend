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
import projectRouter from "../src/routes/project";
import ownerProjectRouter from "../src/routes/ownerProject";
import "./src/connections";
import { User } from "../src/model/userModels";
import Project from "../src/model/projectModels";
import Option from "../src/model/optionModels";
import UserProposer from "../src/model/userProposerModels";

import bcrypt from "bcryptjs";

// ### setup express app
const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);
app.use("/owner/projects", ownerProjectRouter);
app.use("/projects", projectRouter);
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

let projectId: string;
beforeAll(async () => {
  await User.deleteOne({ user_email: user_normal.email });

  console.log("######clear up orders.spec test data");
  newUser = await User.create({
    user_email: user_normal.email,
    user_hash_pwd: bcrypt.hashSync(user_normal.pass || "", 12),
    user_name: "c1_12345678",
    user_roles: [0],
    login_method: [0],
  });

  newProject = await Project.create(project);
  projectId = newProject._id;

  await newProject.save();
});

afterAll(async () => {
  await User.deleteOne({ user_email: user_normal.email });

  await Project.deleteOne({ project_title: project.project_title });

  console.log("######clear up option.spec test data");
});

// ### setup test data
let newUser, newProject;
const user_normal = {
  email: "c_order@test.com",
  pass: "12345678",
  method: 0,
};

const project = {
  project_title: "test project",
  project_summary: "test project summary",
  project_content: "test project content",
  project_category: ["公益"],
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

const option = {
  option_name: "test option",
  option_price: 1000,
  option_total: 50,
  option_content: "test option content",
  option_cover:
    "https://images.unsplash.com/photo-1533206482744-b9766a45e98a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80",
  option_start_date: new Date(),
  option_end_date: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
};

// ### end setup test data ###

describe("projects", () => {
  let token: string;
  let optionId: string;

  // signin
  beforeEach(async () => {
    const res = await request(app).post("/signin").send(user_normal);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data.token.length).toBeGreaterThan(0);
    token = res.body.data.token;
    // console.log(token);
  });

  afterAll(async () => {
    await Project.deleteOne({ _id: projectId });
    await Option.deleteOne({ _id: optionId });
  });

  test("create option", async () => {
    const testPayload = {
      name: option.option_name,
      price: option.option_price,
      total: option.option_total,
      content: option.option_content,
      cover: option.option_cover,
      start_date: option.option_start_date,
      end_date: option.option_end_date,
    };

    const res = await request(app)
      .post(`/owner/projects/${projectId}/options`)
      .set("Authorization", `Bearer ${token}`)
      .send(testPayload);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data.option_parent).toEqual(projectId.toString());

    optionId = res.body.data._id;
  });

  test("get options (owner)", async () => {
    const res = await request(app)
      .get(`/owner/projects/${projectId}/options`)
      .set("Authorization", `Bearer ${token}`);
    // console.log(res.body);
    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");

    expect(res.body.data.length).toEqual(1);
    expect(res.body.data[0]).toHaveProperty("_id");
    expect(res.body.data[0]._id).toEqual(optionId.toString());
  });

  test("get options (normal user)", async () => {
    const res = await request(app)
      .get(`/projects/${projectId}/options`)
      .set("Authorization", `Bearer ${token}`);
    // console.log(res.body);
    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");

    expect(res.body.data.length).toEqual(1);
    expect(res.body.data[0]).toHaveProperty("_id");
    expect(res.body.data[0]._id).toEqual(optionId.toString());
    expect(res.body.data[0]).not.toHaveProperty("option_create_date");
    expect(res.body.data[0]).not.toHaveProperty("option_update_date");
    expect(res.body.data[0]).not.toHaveProperty("delete");
    expect(res.body.data[0]).not.toHaveProperty("delete_member");
  });
});
