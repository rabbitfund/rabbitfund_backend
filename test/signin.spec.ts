import { expect, test, describe } from 'vitest'
import express from "express";
import request from "supertest"

import indexRouter from '../src/routes/index';
import "./src/connections";


const app:express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

describe("sigin", () => {
  test('correct password', async () => {
    const res = await request(app).post("/signin").send({
        "method": 0,
        "email": "c1_12345678@test.com",
        "pass": "12345678",
      })

    expect(res.status).toEqual(200)
    expect(res.body.ok).toEqual(true)
    expect(res.body.msg).toEqual("success")
    expect(res.body.data.token.length).toBeGreaterThan(0)
  })

  test('wrong password', async () => {
    const res = await request(app).post("/signin").send({
        "method": 0,
        "email": "c1_12345678@test.com",
        "pass": "123456789",
      })

    expect(res.status).toEqual(400)
    expect(res.body.ok).toEqual(false)
    expect(res.body.msg).toEqual("帳號或密碼錯誤")
  })

  test('correct google ID', async () => {
    const res = await request(app).post("/signin").send({
        "method": 1,
        "email": "c1_12345678@test.com",
        "oauth_google_id": "123",
      })

    expect(res.status).toEqual(200)
    expect(res.body.ok).toEqual(true)
    expect(res.body.msg).toEqual("success")
    expect(res.body.data.token.length).toBeGreaterThan(0)
  })
  
  // TODO: optimize this test
  // Error may due to email not exist or google ID not match
  test('correct google ID with different email', async () => {
    const res = await request(app).post("/signin").send({
        "method": 1,
        "email": "c1_123456@test.com",
        "oauth_google_id": "123",
      })

      expect(res.status).toEqual(400)
      expect(res.body.ok).toEqual(false)
      expect(res.body.msg).toEqual("帳號或密碼錯誤")
  })

  test('correct google ID without email', async () => {
    const res = await request(app).post("/signin").send({
        "method": 1,
        "oauth_google_id": "123",
      })

    expect(res.status).toEqual(400)
    expect(res.body.ok).toEqual(false)
    expect(res.body.msg).toEqual("欄位填寫不完整或格式錯誤")
  })

  test('wrong google ID', async () => {
    const res = await request(app).post("/signin").send({
        "method": 1,
        "email": "c1_12345678@test.com",
        "oauth_google_id": "12345",
      })

    expect(res.status).toEqual(400)
    expect(res.body.ok).toEqual(false)
    expect(res.body.msg).toEqual("帳號或密碼錯誤")
  })
  
})
