import { startServer } from "./startService";
import {
  expect,
  test,
  describe,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest";
import bcrypt from "bcryptjs";
import { User, UserRole, LoginMethod } from "../src/model/userModels";
import Project from "../src/model/projectModels";
import Option from "../src/model/optionModels";
import UserProposer from "../src/model/userProposerModels";

import UserLikeProject from "../src/model/userLikeProjectModels";

import request from "supertest";

import "./src/connections";

// ### setup express app
const app = startServer();

// ### setup test data
let newUser, newUser2, newProject, newProposer, newOption1, newOption2;

const user_normal = {
  email: "user_like_1@test.com",
  pass: "12345678",
  login_method: [LoginMethod.NORMAL],
  user_roles: [UserRole.PROVIDER, UserRole.SUPPORTER],
  user_name: "user_like",
  user_intro: "intro_" + Date.now(),
};
const user2_normal = {
  email: "user_like_2@test.com",
  pass: "12345678",
  login_method: [LoginMethod.NORMAL],
  user_roles: [UserRole.PROVIDER, UserRole.SUPPORTER],
  user_name: "user_like",
  user_intro: "intro_" + Date.now(),
};
// UserProposer
const projectOwnerInfo = {
  proposer_name: "提案方 proposer - like",
  // proposer_create: "", // --> user
  proposer_email: "proposer_like@test.com",
  proposer_tax_id: "87654321",
};
const projectOption1 = {
  // option_parent: "", // --> project
  option_name: "方案 option1 - like",
  option_price: 1000,
  option_total: 100,
  option_content: "方案 option1 - like content",
  option_status: 2,
  option_start_date: new Date(),
  option_end_date: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
};
const projectOption2 = {
  // option_parent: "", // --> project
  option_name: "方案 option2 - like",
  option_price: 1000,
  option_total: 100,
  option_content: "方案 option2 - like content",
  option_status: 2,
  option_start_date: new Date(),
  option_end_date: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
};

const project = {
  project_title: "專案 project - like",
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
  console.log("######clear up user.spec test data");
  await User.deleteOne({ user_email: user_normal.email });
  await User.deleteOne({ user_email: user2_normal.email });

  newUser = await User.create({
    user_email: user_normal.email,
    user_hash_pwd: bcrypt.hashSync(user_normal.pass || "", 12),
    user_name: user_normal.user_name,
    user_roles: user_normal.user_roles,
    login_method: user_normal.login_method,
    user_intro: user_normal.user_intro,
  });
  newUser2 = await User.create({
    user_email: user2_normal.email,
    user_hash_pwd: bcrypt.hashSync(user2_normal.pass || "", 12),
    user_name: user2_normal.user_name,
    user_roles: user2_normal.user_roles,
    login_method: user2_normal.login_method,
    user_intro: user2_normal.user_intro,
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
  await User.deleteOne({ _id: newUser._id });
  await User.deleteOne({ _id: newUser2._id });
  await UserProposer.deleteOne({ _id: newProposer._id });
  await Option.deleteOne({ _id: newOption1._id });
  await Option.deleteOne({ _id: newOption2._id });
  await Project.deleteOne({ _id: newProject._id });
});

describe("user like project api test", () => {
  let token: string;
  let likeObj: any;

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

  test("create like", async () => {
    const res = await request(app)
      .post("/me/likes")
      .set("Authorization", `Bearer ${token}`)
      .send({ pid: newProject._id });

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data.length).toEqual(1);
    expect(res.body.data[0].user).toEqual(newUser._id.toString());
    expect(res.body.data[0].project._id).toEqual(newProject._id.toString());
    likeObj = res.body.data[0];
  });

  test("get likes", async () => {
    const res = await request(app)
      .get("/me/likes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data.length).toEqual(1);
    expect(res.body.data[0].user).toEqual(newUser._id.toString());
    expect(res.body.data[0].project._id).toEqual(newProject._id.toString());
  });

  test("remove like", async () => {
    const res = await request(app)
      .delete(`/me/likes/${likeObj.project._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data).toEqual(true);
  });
});

describe("verfiy userlikeproject schema", () => {
  test("test create,get(joining),remove and compound index ", async () => {
    const res = await UserLikeProject.create({
      user: newUser._id,
      project: newProject._id,
    });
    expect(res.user).toBe(newUser._id);

    const res2 = await UserLikeProject.create({
      user: newUser2._id,
      project: newProject._id,
    });
    expect(res2.user).toBe(newUser2._id);

    const likes = await UserLikeProject.find({ user: newUser._id })
      .populate("user", ["user_name", "user_email", "user_cover"])
      .populate("project", ["project_title", "project_summary"]);
    // console.log(likes);

    expect(likes.length).toBe(1);

    // find one user's likes
    const likes2 = await UserLikeProject.find({ user: newUser2._id })
      .populate("user", ["user_name", "user_email", "user_cover"])
      .populate("project", ["project_title", "project_summary"]);
    // console.log(likes2);
    expect(likes2.length).toBe(1);

    // find one project's likes
    const likes3 = await UserLikeProject.find({ project: newProject._id })
      .populate("user", ["user_name", "user_email", "user_cover"])
      .populate("project", ["project_title", "project_summary"]);
    // console.log(likes3);
    expect(likes3.length).toBe(2);

    // remove user's likes
    const res3 = await UserLikeProject.deleteOne({
      user: newUser2._id,
      project: newProject._id,
    });
    expect(res3.deletedCount).toBe(1);
    // again find one user's likes
    const likes4 = await UserLikeProject.find({ user: newUser2._id })
      .populate("user", ["user_name", "user_email", "user_cover"])
      .populate("project", ["project_title", "project_summary"]);
    // console.log(likes2);
    expect(likes4.length).toBe(0);

    // remove project's likes
    const res4 = await UserLikeProject.deleteMany({
      project: newProject._id,
    });
    expect(res4.deletedCount).toBe(1);
  });
});
