import "./src/connections";
import express, { Request, Response, NextFunction } from "express";

import createError from "http-errors";
import indexRouter from "../src/routes/index";
import meRouter from "../src/routes/me";
import ownerProjectRouter from "../src/routes/ownerProject";
import projectRouter from "../src/routes/project";
import userproposerRouter from "../src/routes/userProposer";

// ### setup express app
export function startServer() {
  const app: express.Application = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use("/", indexRouter);
  app.use("/me", meRouter);
  app.use("/owner/projects", ownerProjectRouter);
  app.use("/projects", projectRouter);
  app.use("/userProposer", userproposerRouter);
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

  return app;
}
