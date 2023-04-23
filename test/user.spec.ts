import { expect, test, describe, beforeAll } from 'vitest'
import express from "express";
import request from "supertest"

import indexRouter from '../src/routes/index';
import meRouter from '../src/routes/me';
import "./src/connections";


const app:express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);
app.use("/me", meRouter);


describe("user", () => {
  let token: string
  // signin
  beforeAll(async () => {
    const res = await request(app).post("/signin").send({
      "method": 0,
      "email": "c1_12345678@test.com",
      "pass": "12345678",
    })

    expect(res.status).toEqual(200)
    expect(res.body.ok).toEqual(true)
    expect(res.body.msg).toEqual("success")
    expect(res.body.data.token.length).toBeGreaterThan(0)
    token = res.body.data.token
    console.log(token)
  })

  test('get user data', async () => {
    const res = await request(app).get("/me/user")
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toEqual(200)
    expect(res.body.ok).toEqual(true)
    expect(res.body.msg).toEqual("success")
    expect(res.body.data.user_name.length).toBeGreaterThanOrEqual(2)
    expect(res.body.data.user_email).toEqual("c1_12345678@test.com")
    // should contain 0 instead?
    expect(res.body.data.login_method).toContain(1)
    expect(res.body.data.user_create_date.length).toEqual(24)   // e.g. 2023-04-22T07:33:50.717Z
  })

  test('update user data', async () => {
    // get current user data
    const res_c4 = await request(app).get("/me/user")
      .set("Authorization", `Bearer ${token}`)

    expect(res_c4.status).toEqual(200)
    expect(res_c4.body.ok).toEqual(true)
    expect(res_c4.body.msg).toEqual("success")

    const intro = res_c4.body.data.user_intro.split("_")[0]
    const date = new Date()
    const now = Date.now()
    
    // update user data
    const res_c3 = await request(app).put("/me/user")
      .set("Authorization", `Bearer ${token}`)
      .send({
        "name": "b4x",    
        "cover": "https://img.com/b2xx",
        "phone": "988123123",
        "intro": `${intro}_${now}`,
        "website": "",
        "interests": ["dance","sing"]
      })
    
    expect(res_c3.status).toEqual(200)
    expect(res_c3.body.ok).toEqual(true)
    expect(res_c3.body.msg).toEqual("success")
    expect(res_c3.body.data.user_name).toEqual("b4x")
    expect(res_c3.body.data.user_cover).toEqual("https://img.com/b2xx")//
    expect(res_c3.body.data.user_phone).toEqual("988123123")
    expect(res_c3.body.data.user_intro).toEqual(`${intro}_${now}`)
    expect(res_c3.body.data.user_website).toEqual("")
    expect(res_c3.body.data.user_interests).toEqual(["dance","sing"])

    // getuser data again
    const res_c4_2 = await request(app).get("/me/user")
      .set("Authorization", `Bearer ${token}`)

    expect(res_c4_2.status).toEqual(200)
    expect(res_c4_2.body.ok).toEqual(true)
    expect(res_c4_2.body.msg).toEqual("success")
    expect(res_c4_2.body.data.user_name).toEqual("b4x")
    expect(res_c4_2.body.data.user_cover).toEqual("https://img.com/b2xx")//
    expect(res_c4_2.body.data.user_phone).toEqual("988123123")
    expect(res_c4_2.body.data.user_intro).toEqual(`${intro}_${now}`)
    expect(res_c4_2.body.data.user_website).toEqual("")
    expect(res_c4_2.body.data.user_interests).toEqual(["dance","sing"])
  })
})

