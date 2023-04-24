import {
  expect,
  test,
  describe,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest";
import express, { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import request from "supertest";

import indexRouter from "../src/routes/index";
import meRouter from "../src/routes/me";
import "./src/connections";
import { User } from "../src/model/userModels";
import bcrypt from "bcryptjs";

// ### setup express app
const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);
app.use("/me", meRouter);
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
  console.log("######clear up user.spec test data");
  await User.create({
    user_email: user_normal.email,
    user_hash_pwd: bcrypt.hashSync(user_normal.pass || "", 12),
    user_name: "c2_12345678",
    user_role: [0],
    login_method: [0],
    user_intro: user_normal.user_intro,
  });
  await User.create({
    user_email: user_google.email,
    user_hash_pwd: bcrypt.hashSync("", 12),
    user_name: "c8_12345678",
    user_role: [0],
    login_method: [1],
    oauth_google_id: user_google.oauth_google_id || "",
    user_intro: user_google.user_intro,
  });
});
afterAll(async () => {
  await User.deleteOne({ user_email: user_normal.email });
  await User.deleteOne({ user_email: user_google.email });
  console.log("######clear up user.spec test data");
});
// ### setup test data
const user_normal = {
  email: "c2_12345678@test.com",
  pass: "12345678",
  method: 0,
  user_intro: "intro_" + Date.now(),
};
const user_google = {
  email: "c8_12345678@test.com",
  oauth_google_id: "456",
  method: 1,
  user_intro: "intro_" + Date.now(),
};
// ### end setup test data ###

describe("user normal login", () => {
  let token: string;
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

  test("get user data", async () => {
    const res = await request(app)
      .get("/me/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data.user_name.length).toBeGreaterThanOrEqual(2);
    expect(res.body.data.user_email).toEqual(user_normal.email);
    // should contain 0 instead?
    expect(res.body.data.login_method).toContain(0);
    expect(res.body.data.user_create_date.length).toEqual(24); // e.g. 2023-04-22T07:33:50.717Z
  });

  test("update user data", async () => {
    // get current user data
    const res_c4 = await request(app)
      .get("/me/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res_c4.status).toEqual(200);
    expect(res_c4.body.ok).toEqual(true);
    expect(res_c4.body.msg).toEqual("success");

    const intro = res_c4.body.data.user_intro.split("_")[0];
    const date = new Date();
    const now = Date.now();

    // update user data
    const res_c3 = await request(app)
      .put("/me/user")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "b4x",
        cover: "https://img.com/b2xx",
        phone: "988123123",
        intro: `${intro}_${now}`,
        website: "",
        interests: ["dance", "sing"],
      });

    expect(res_c3.status).toEqual(200);
    expect(res_c3.body.ok).toEqual(true);
    expect(res_c3.body.msg).toEqual("success");
    expect(res_c3.body.data.user_name).toEqual("b4x");
    expect(res_c3.body.data.user_cover).toEqual("https://img.com/b2xx"); //
    expect(res_c3.body.data.user_phone).toEqual("988123123");
    expect(res_c3.body.data.user_intro).toEqual(`${intro}_${now}`);
    expect(res_c3.body.data.user_website).toEqual("");
    expect(res_c3.body.data.user_interests).toEqual(["dance", "sing"]);

    // getuser data again
    const res_c4_2 = await request(app)
      .get("/me/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res_c4_2.status).toEqual(200);
    expect(res_c4_2.body.ok).toEqual(true);
    expect(res_c4_2.body.msg).toEqual("success");
    expect(res_c4_2.body.data.user_name).toEqual("b4x");
    expect(res_c4_2.body.data.user_cover).toEqual("https://img.com/b2xx"); //
    expect(res_c4_2.body.data.user_phone).toEqual("988123123");
    expect(res_c4_2.body.data.user_intro).toEqual(`${intro}_${now}`);
    expect(res_c4_2.body.data.user_website).toEqual("");
    expect(res_c4_2.body.data.user_interests).toEqual(["dance", "sing"]);
  });
});
describe("user google login", () => {
  let token: string;
  // signin
  beforeEach(async () => {
    const res = await request(app).post("/signin").send(user_google);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data.token.length).toBeGreaterThan(0);
    token = res.body.data.token;
    // console.log(token);
  });

  test("get user data", async () => {
    const res = await request(app)
      .get("/me/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toEqual(200);
    expect(res.body.ok).toEqual(true);
    expect(res.body.msg).toEqual("success");
    expect(res.body.data.user_name.length).toBeGreaterThanOrEqual(2);
    expect(res.body.data.user_email).toEqual(user_google.email);
    // should contain 0 instead?
    expect(res.body.data.login_method).toContain(user_google.method);
    expect(res.body.data.user_create_date.length).toEqual(24); // e.g. 2023-04-22T07:33:50.717Z
  });

  test("update user data", async () => {
    // get current user data
    const res_c4 = await request(app)
      .get("/me/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res_c4.status).toEqual(200);
    expect(res_c4.body.ok).toEqual(true);
    expect(res_c4.body.msg).toEqual("success");

    const intro = res_c4.body.data.user_intro.split("_")[0];
    const date = new Date();
    const now = Date.now();

    // update user data
    const res_c3 = await request(app)
      .put("/me/user")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "b4x-google",
        cover: "https://img.com/b2xx",
        phone: "988123123",
        intro: `${intro}_${now}`,
        website: "",
        interests: ["dance", "sing"],
      });

    expect(res_c3.status).toEqual(200);
    expect(res_c3.body.ok).toEqual(true);
    expect(res_c3.body.msg).toEqual("success");
    expect(res_c3.body.data.user_name).toEqual("b4x-google");
    expect(res_c3.body.data.user_cover).toEqual("https://img.com/b2xx"); //
    expect(res_c3.body.data.user_phone).toEqual("988123123");
    expect(res_c3.body.data.user_intro).toEqual(`${intro}_${now}`);
    expect(res_c3.body.data.user_website).toEqual("");
    expect(res_c3.body.data.user_interests).toEqual(["dance", "sing"]);

    // getuser data again
    const res_c4_2 = await request(app)
      .get("/me/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res_c4_2.status).toEqual(200);
    expect(res_c4_2.body.ok).toEqual(true);
    expect(res_c4_2.body.msg).toEqual("success");
    expect(res_c4_2.body.data.user_name).toEqual("b4x-google");
    expect(res_c4_2.body.data.user_cover).toEqual("https://img.com/b2xx"); //
    expect(res_c4_2.body.data.user_phone).toEqual("988123123");
    expect(res_c4_2.body.data.user_intro).toEqual(`${intro}_${now}`);
    expect(res_c4_2.body.data.user_website).toEqual("");
    expect(res_c4_2.body.data.user_interests).toEqual(["dance", "sing"]);
  });
});
