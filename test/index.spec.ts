import { expect, test } from 'vitest'
import express from "express";
import request from "supertest"

import indexRouter from '../src/routes/index';

const app:express.Application = express();
app.use('/', indexRouter);

test('index', async () => {
  const res = await request(app).get("/")
  expect(res.status).toEqual(200)
  expect(res.text).toEqual("index")
})