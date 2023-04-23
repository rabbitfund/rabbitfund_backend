import { expect, test, describe } from 'vitest'
import express from "express";
import request from "supertest"

import indexRouter from '../src/routes/index';
import "./src/connections";


const app:express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

// name and email is always required

describe("signup (method 0)", () => {
  // test('correct format', async () => {
  //   const res = await request(app).post("/signup").send({
  //       "email": "c1_666@test.com",
  //       "pass": "12345678",
  //       "name": "a2",
  //       "method": 0,
  //     })

  //   expect(res.status).toEqual(200)
  //   expect(res.body.ok).toEqual(true)
  //   expect(res.body.msg).toContain("")
  // })

  test('email already existed', async () => {
    const res = await request(app).post("/signup").send({
        "email": "c1_12345678@test.com",
        "pass": "12345678",
        "name": "a2",
        "method": 0,
      })

    expect(res.status).toEqual(400)
    expect(res.body.ok).toEqual(false)
    expect(res.body.msg).toContain("E11000 duplicate key error collection")
    // is the error msg correct?
  })

  test('missing email', async () => {
    const res = await request(app).post("/signup").send({
        "pass": "12345678",
        "name": "a2",
        "method": 0,
      })

    expect(res.status).toEqual(400)
    expect(res.body.ok).toEqual(false)
    expect(res.body.msg).toEqual("欄位填寫不完整或格式錯誤")
  })

  test('missing name', async () => {
    const res = await request(app).post("/signup").send({
        "email": "c1_12345678@test.com",
        "pass": "12345678",
        "method": 0,
      })

    expect(res.status).toEqual(400)
    expect(res.body.ok).toEqual(false)
    expect(res.body.msg).toEqual("欄位填寫不完整或格式錯誤")
  })

  test.each([
    [1], [2], [3], [4], [5], [6], [7]
  ])('password too short (%i)', async (n) => {
    const res = await request(app).post("/signup").send({
        "email": "c1_12345678@test.com",
        "pass": "123",
        "name": "a".repeat(n),
        "method": 0,
      })

    expect(res.status).toEqual(400)
    expect(res.body.ok).toEqual(false)
    expect(res.body.msg).toEqual("欄位填寫不完整或格式錯誤")
  })

  test('name too short', async () => {
    const res = await request(app).post("/signup").send({
        "email": "c1_12345678@test.com",
        "pass": "12345678",
        "name": "a",
        "method": 0,
      })

    expect(res.status).toEqual(400)
    expect(res.body.ok).toEqual(false)
    expect(res.body.msg).toEqual("欄位填寫不完整或格式錯誤")
  })

  // TODO: delete account
})

describe("signup (method 1)", () => {
  test('email existed error', async () => {
    const res = await request(app).post("/signup").send({
        "email": "c1_12345678@test.com",
        "pass": "12345678",
        "name": "a2",
        "method": 1,
        "oauth_google_id": "123"
      })

    expect(res.status).toEqual(400)
    expect(res.body.ok).toEqual(false)
    expect(res.body.msg).toContain("E11000 duplicate key error collection")
    // is the error msg correct?
  })

  // google id signup need password?
  test('missing password', async () => {
    const res = await request(app).post("/signup").send({
        "email": "c1_12345678@test.com",
        "name": "a2",
        "method": 1,
        "oauth_google_id": "123",
      })

    expect(res.status).toEqual(400)
    expect(res.body.ok).toEqual(false)
    expect(res.body.msg).toContain("E11000 duplicate key error collection")
    // return "Illegal arguments: undefined, string"
    // is the error msg correct?
  })

  test('short password', async () => {
    const res = await request(app).post("/signup").send({
        "email": "c1_12345678@test.com",
        "pass": "123",
        "name": "a2",
        "method": 1,
        "oauth_google_id": "123",
      })

    expect(res.status).toEqual(400)
    expect(res.body.ok).toEqual(false)
    expect(res.body.msg).toContain("E11000 duplicate key error collection")
    // is the error msg correct?
  })
})