import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import indexRouter from "./routes/index";
import meRouter from "./routes/me";
import ownerProjectRouter from "./routes/ownerProject";
import projectRouter from "./routes/project";
import uploadRouter from "./routes/upload";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from '../swagger_output.json';

import "./connections";

const app: express.Application = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/me", meRouter);
app.use("/owner/projects", ownerProjectRouter);
app.use("/projects", projectRouter);
app.use("/upload", uploadRouter);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

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

module.exports = app;
