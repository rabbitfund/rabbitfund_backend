import { expect, test, describe, beforeAll, afterAll } from "vitest";
import express, { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import request from "supertest";

import indexRouter from "../src/routes/index";
import "./src/connections";
import { User } from "../src/model/userModels";

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

// ### setup test data
const user_normal = {
  email: "c1_666@test.com",
  pass: "12345678",
  name: "a666",
  method: 0,
};
const user_missing_email = {
  pass: "12345678",
  name: "a666",
  method: 0,
};
const user_missing_name = {
  email: "c1_666@test.com",
  pass: "12345678",
  method: 0,
};
const user_normal_method1 = {
  email: "c1_777@test.com",
  name: "a777",
  method: 1,
  oauth_google_id: "123",
};
const user_missing_googleid_method1 = {
  email: "c1_777@test.com",
  name: "a777",
  method: 1,
};
const user_missing_email_method1 = {
  name: "a777",
  method: 1,
  oauth_google_id: "123",
};
const user_missing_name_method1 = {
  email: "c1_777@test.com",
  method: 1,
  oauth_google_id: "123",
};

// ### end setup test data ###

beforeAll(async () => {
  await User.deleteOne({ user_email: user_normal.email });
  await User.deleteOne({ user_email: user_normal_method1.email });
  console.log("######clear up signup.spec test data");
});
afterAll(async () => {
  await User.deleteOne({ user_email: user_normal.email });
  await User.deleteOne({ user_email: user_normal_method1.email });
  console.log("######clear up sigup.spec test data");
});

describe("signup (method 0)", () => {
  test("correct format", async () => {
    const res = await request(app).post("/signup").send(user_normal);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toContain("success");
  });

  test("email already existed", async () => {
    const res = await request(app).post("/signup").send(user_normal);
    // console.log(res);
    expect(res.status).toEqual(500);
    expect(res.body.ok).toEqual(false);
    expect(res.body.msg).toContain("E11000 duplicate key error collection");
    // is the error msg correct?
  });

  test("missing email", async () => {
    const res = await request(app).post("/signup").send(user_missing_email);

    expect(res.status).toEqual(400);
    expect(res.body.ok).toEqual(false);
    expect(res.body.msg).toEqual("欄位填寫不完整或格式錯誤");
  });

  test("missing name", async () => {
    const res = await request(app).post("/signup").send(user_missing_name);

    expect(res.status).toEqual(400);
    expect(res.body.ok).toEqual(false);
    expect(res.body.msg).toEqual("欄位填寫不完整或格式錯誤");
  });

  test.each([[1], [2], [3], [4], [5], [6], [7]])(
    "password too short (%i)",
    async (n) => {
      const res = await request(app)
        .post("/signup")
        .send({
          email: "c1_12345678@test.com",
          pass: "1".repeat(n),
          name: "my name",
          method: 0,
        });

      expect(res.status).toEqual(400);
      expect(res.body.ok).toEqual(false);
      expect(res.body.msg).toEqual("欄位填寫不完整或格式錯誤");
    }
  );

  test("name too short", async () => {
    const res = await request(app).post("/signup").send({
      email: "c1_12345678@test.com",
      pass: "12345678",
      name: "a",
      method: 0,
    });

    expect(res.status).toEqual(400);
    expect(res.body.ok).toEqual(false);
    expect(res.body.msg).toEqual("欄位填寫不完整或格式錯誤");
  });

  // TODO: delete account
});

describe("signup (method 1)", () => {
  test("correct format", async () => {
    const res = await request(app).post("/signup").send(user_normal_method1);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toContain("success");
  });

  test("email already existed", async () => {
    const res = await request(app).post("/signup").send(user_normal_method1);

    expect(res.status).toEqual(500);
    expect(res.body.ok).toEqual(false);
    expect(res.body.msg).toContain("E11000 duplicate key error collection");
    //
  });
  test("missing google id", async () => {
    const res = await request(app)
      .post("/signup")
      .send(user_missing_googleid_method1);

    expect(res.status).toEqual(400);
    expect(res.body.ok).toEqual(false);
    expect(res.body.msg).toEqual("欄位填寫不完整或格式錯誤");
  });
  test("missing email", async () => {
    const res = await request(app)
      .post("/signup")
      .send(user_missing_email_method1);

    expect(res.status).toEqual(400);
    expect(res.body.ok).toEqual(false);
    expect(res.body.msg).toEqual("欄位填寫不完整或格式錯誤");
  });

  test("missing name", async () => {
    const res = await request(app)
      .post("/signup")
      .send(user_missing_name_method1);

    expect(res.status).toEqual(400);
    expect(res.body.ok).toEqual(false);
    expect(res.body.msg).toEqual("欄位填寫不完整或格式錯誤");
  });

  test("name too short", async () => {
    const res = await request(app).post("/signup").send({
      email: "c1_12345678@test.com",
      name: "a",
      method: 1,
      oauth_google_id: "123",
    });

    expect(res.status).toEqual(400);
    expect(res.body.ok).toEqual(false);
    expect(res.body.msg).toEqual("欄位填寫不完整或格式錯誤");
  });
});
