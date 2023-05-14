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

  // newProject = await Project.create(project);

  // await newProject.save();
});

afterAll(async () => {
  await User.deleteOne({ user_email: user_normal.email });

  // await Project.deleteOne({ project_title: project.project_title });

  console.log("######clear up project.spec test data");
});

// ### setup test data
let newUser;
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

// const owner = {
//   proposer_name: "test proposer",

// }
// ### end setup test data ###

describe("projects", () => {
  let token: string;
  let projectId: string;

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

  afterAll(async () => {
    await Project.deleteOne({ _id: projectId });
  });

  test("create project", async () => {
    const testPayload = {
      title: project.project_title,
      summary: project.project_summary,
      content: project.project_content,
      category: project.project_category,
      target: project.project_target,
      progress: project.project_progress,
      start_date: project.project_start_date,
      end_date: project.project_end_date,
      cover: project.project_cover,
      risks: project.project_risks,
    };

    const res = await request(app)
      .post("/owner/projects")
      .set("Authorization", `Bearer ${token}`)
      .send(testPayload);
    
    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data).toHaveProperty("_id");
    
    projectId = res.body.data._id;
  });

  test("get project (owner) (unfinished)", async () => {
    const res = await request(app)
      .get("/owner/projects")
      .set("Authorization", `Bearer ${token}`)
    // console.log(res.body)
    
    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
  })

  test("get specific project", async () => {
    const res = await request(app)
      .get(`/owner/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`)
    
    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data._id).toEqual(projectId);
  })

  test("modify specific project", async () => {
    const newTitle = "test title (modified)"
    const res = await request(app)
      .put(`/owner/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: newTitle
      })
    
    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data._id).toEqual(projectId);
    expect(res.body.data.project_title).toEqual(newTitle);
  })

  test("get project (normal user)", async () => {
    const res = await request(app)
      .get("/projects")
      .set("Authorization", `Bearer ${token}`)
    console.log(res.body)
    
    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data).not.toHaveProperty("project_update_date")
    expect(res.body.data).not.toHaveProperty("project_update_final_member")
    expect(res.body.data).not.toHaveProperty("delete")
    expect(res.body.data).not.toHaveProperty("delete_member")
  })

  test("delete specific project", async () => {
    const res = await request(app)
      .delete(`/owner/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`)
    console.log(res.body)
    
    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");

    const res2 = await request(app)
      .get(`/owner/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`)
    
    expect(res2.status).toEqual(400);
    expect(res2.body.ok).toEqual(false);
    expect(res2.body.msg).toEqual("找不到專案");
  })
});
