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

const user_normal = {
  email: "user_proposer@test.com",
  pass: "12345678",
  login_method: [LoginMethod.NORMAL],
  user_roles: [UserRole.PROVIDER, UserRole.SUPPORTER],
  user_name: "user_like",
  user_intro: "intro_" + Date.now(),
};

const proposer = {
  proposer_name: "test proposer (proposer.spec.ts)",
  proposer_cover: "cover URL",
  proposer_email: "user_proposer@test.com",
  proposer_phone: "0911222333",
  proposer_tax_id: "55556667",
  proposer_intro: "test proposer intro",
  proposer_website: "website URL"
}

// ### end setup test data ###
beforeAll(async () => {
  await User.deleteOne({ user_email: user_normal.email });
  await UserProposer.deleteOne({ proposer_name: proposer.proposer_name });

  console.log("######clear up proposer.spec test data");
  newUser = await User.create({
    user_email: user_normal.email,
    user_hash_pwd: bcrypt.hashSync(user_normal.pass || "", 12),
    user_name: user_normal.user_name,
    user_roles: user_normal.user_roles,
    login_method: user_normal.login_method,
  });
});

afterAll(async () => {
  console.log("######clear up proposer.spec test data");
  await User.deleteOne({ _id: newUser._id });

  await UserProposer.deleteOne({ proposer_name: proposer.proposer_name });
});

describe("proposers", () => {
  let token: string;
  let proposerId: string;

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
    console.log(token);
  });

  afterAll(async () => {
    // await Proposer.deleteOne({ _id: proposerId });
  });

  test("create proposer", async () => {
    const testPayload = {
      proposer_name: proposer.proposer_name,
      proposer_cover: proposer.proposer_cover,
      proposer_email: proposer.proposer_email,
      proposer_phone: proposer.proposer_phone,
      proposer_tax_id: proposer.proposer_tax_id,
      proposer_intro: proposer.proposer_intro,
      proposer_website: proposer.proposer_website
    };

    const res = await request(app)
      .post("/userProposer")
      .set("Authorization", `Bearer ${token}`)
      .send(testPayload);
    // console.log("create proposer=", res.body);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data).toHaveProperty("_id");

    proposerId = res.body.data._id;
  });

  test("get self proposer", async () => {
    const res = await request(app)
      .get("/userProposer")
      .set("Authorization", `Bearer ${token}`);
    // console.log(res.body);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]._id).toEqual(proposerId);
  });
});
