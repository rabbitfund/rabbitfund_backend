import { expect, test, describe, beforeAll, afterAll } from "vitest";
import express, { Request, Response, NextFunction } from "express";
import request from "supertest";
import createError from "http-errors";
import indexRouter from "../src/routes/index";
import "./src/connections";
import { User } from "../src/model/userModels";
import bcrypt from "bcryptjs";

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
  await User.deleteOne({ user_email: user_google.email });
  console.log("######clear up signin.spec test data");
  await User.create({
    user_email: user_normal.email,
    user_hash_pwd: bcrypt.hashSync(user_normal.pass || "", 12),
    user_name: "c1_12345678",
    user_roles: [0],
    login_method: [0],
  });
  await User.create({
    user_email: user_google.email,
    user_hash_pwd: bcrypt.hashSync("", 12),
    user_name: "c9_12345678",
    user_roles: [0],
    login_method: [1],
    oauth_google_id: user_google.oauth_google_id || "",
  });
});
afterAll(async () => {
  await User.deleteOne({ user_email: user_normal.email });
  await User.deleteOne({ user_email: user_google.email });
  console.log("######clear up signin.spec test data");
});

// ### setup test data
const user_normal = {
  email: "c1_12345678@test.com",
  pass: "12345678",
  method: 0,
};
const user_wrong_pass = {
  email: "c1_12345678@test.com",
  pass: "12312345678",
  method: 0,
};
const user_google = {
  email: "c9_12345678@test.com",
  oauth_google_id: "123",
  method: 1,
};
const user_google_missing_email = {
  oauth_google_id: "123",
  method: 1,
};
const user_google_wrong_email = {
  email: "c1_12345678@test.com",
  oauth_google_id: "123",
  method: 1,
};
const user_google_wrong_gooleid = {
  email: "c9_12345678@test.com",
  oauth_google_id: "456",
  method: 1,
};

// ### end setup test data ###

describe("sigin", () => {
  test("correct password", async () => {
    const res = await request(app).post("/signin").send(user_normal);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data.token.length).toBeGreaterThan(0);
  });

  test("wrong password", async () => {
    const res = await request(app).post("/signin").send(user_wrong_pass);

    expect(res.status).toEqual(401);
    expect(res.body.ok).toEqual(false);
    expect(res.body.msg).toEqual("帳號或密碼錯誤");
  });

  test("correct google ID", async () => {
    const res = await request(app).post("/signin").send(user_google);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data.token.length).toBeGreaterThan(0);
  });

  // TODO: optimize this test
  // Error may due to email not exist or google ID not match
  test("correct google ID with different email", async () => {
    const res = await request(app)
      .post("/signin")
      .send(user_google_wrong_email);

    expect(res.status).toEqual(401);
    expect(res.body.ok).toEqual(false);
    expect(res.body.msg).toEqual("帳號或密碼錯誤");
  });

  test("correct google ID without email", async () => {
    const res = await request(app)
      .post("/signin")
      .send(user_google_missing_email);

    expect(res.status).toEqual(400);
    expect(res.body.ok).toEqual(false);
    expect(res.body.msg).toEqual("欄位填寫不完整或格式錯誤");
  });

  test("wrong google ID", async () => {
    const res = await request(app)
      .post("/signin")
      .send(user_google_wrong_gooleid);

    expect(res.status).toEqual(401);
    expect(res.body.ok).toEqual(false);
    expect(res.body.msg).toEqual("帳號或密碼錯誤");
  });
});
