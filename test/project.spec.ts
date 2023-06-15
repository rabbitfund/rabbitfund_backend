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
import express, { Request, Response, NextFunction } from "express";
import request from "supertest";
import createError from "http-errors";
import indexRouter from "../src/routes/index";
import projectRouter from "../src/routes/project";
import ownerProjectRouter from "../src/routes/ownerProject";
import "./src/connections";
import { User, UserRole, LoginMethod } from "../src/model/userModels";
import Project from "../src/model/projectModels";
import UserProposer from "../src/model/userProposerModels";

import bcrypt from "bcryptjs";

// ### setup express app
const app = startServer();

// ### setup test data
let newUser;
let newProposer;

const user_normal = {
  email: "user_project@test.com",
  pass: "12345678",
  login_method: [LoginMethod.NORMAL],
  user_roles: [UserRole.PROVIDER, UserRole.SUPPORTER],
  user_name: "user_like",
  user_intro: "intro_" + Date.now(),
};

const proposer = {
  proposer_name: "test proposer (project.spec.ts)",
  proposer_cover: "cover URL",
  proposer_email: "proposer_project@test.com",
  proposer_phone: "0912777888",
  proposer_tax_id: "55556666",
  proposer_intro: "intro_" + Date.now(),
  proposer_website: "proposer website"
};

const project = {
  project_title: "test project (project.spec.ts)",
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

// const owner = {
//   proposer_name: "test proposer",

// }
// ### end setup test data ###
beforeAll(async () => {
  await User.deleteOne({ user_email: user_normal.email });
  await UserProposer.deleteOne({ proposer_name: proposer.proposer_name });
  await Project.deleteOne({ project_title: project.project_title });

  console.log("######clear up project.spec test data");
  newUser = await User.create({
    user_email: user_normal.email,
    user_hash_pwd: bcrypt.hashSync(user_normal.pass || "", 12),
    user_name: user_normal.user_name,
    user_roles: user_normal.user_roles,
    login_method: user_normal.login_method,
  });

  newProposer = await UserProposer.create({
    proposer_create: newUser._id.toString(),
    proposer_name: proposer.proposer_name,
    proposer_update_date: Date.now(),
    proposer_cover: proposer.proposer_cover,
    proposer_email: proposer.proposer_email,
    proposer_phone: proposer.proposer_phone,
    proposer_tax_id: proposer.proposer_tax_id,
    proposer_intro: proposer.proposer_intro,
    proposer_website: proposer.proposer_website
  });
});

afterAll(async () => {
  console.log("######clear up project.spec test data");
  await User.deleteOne({ _id: newUser._id.toString() });
  await UserProposer.deleteOne({ _id: newProposer._id.toString() });
});

describe("projects", () => {
  let token: string;
  let projectId: string;

  // signin
  beforeEach(async () => {
    const res = await request(app).post("/signin").send({
      email: user_normal.email,
      pass: user_normal.pass,
      method: user_normal.login_method[0],
      forget: false,
    });

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data.token.length).toBeGreaterThan(0);
    token = res.body.data.token;
    // console.log(token);
  });

  afterAll(async () => {
    // await Project.deleteOne({ _id: projectId });
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
      owner: newProposer._id.toString()
    };

    const res = await request(app)
      .post("/owner/projects")
      .set("Authorization", `Bearer ${token}`)
      .send(testPayload);
    // console.log("create project=", res.body);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data).toHaveProperty("_id");

    projectId = res.body.data._id;
  });

  test("get project (owner) (unfinished)", async () => {
    const res = await request(app)
      .get("/owner/projects")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
  });

  test("get specific project", async () => {
    const res = await request(app)
      .get(`/owner/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data._id).toEqual(projectId);
  });

  test.skip("modify specific project", async () => {
    const newTitle = "test title (modified)";
    const res = await request(app)
      .put(`/owner/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: newTitle,
      });
    // console.log("modify res=", res.body);
    // console.log("modify pid=", projectId);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data._id).toEqual(projectId);
    expect(res.body.data.project_title).toEqual(newTitle);
  });

  test.skip("get project (normal user)", async () => {
    const res = await request(app)
      .get("/projects")
      .set("Authorization", `Bearer ${token}`);
    console.log(res.body);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data).not.toHaveProperty("project_update_date");
    expect(res.body.data).not.toHaveProperty("project_update_final_member");
    expect(res.body.data).not.toHaveProperty("delete");
    expect(res.body.data).not.toHaveProperty("delete_member");
  });

  test("delete specific project", async () => {
    const res = await request(app)
      .delete(`/owner/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`);
    // console.log(res.body);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");

    const res2 = await request(app)
      .get(`/owner/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res2.status).toEqual(400);
    expect(res2.body.ok).toEqual(false);
    expect(res2.body.msg).toEqual("找不到專案");
  });
});
