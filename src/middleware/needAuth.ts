import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authStr = req.headers.authorization;
  if (!authStr) {
    return res.status(401).send({ message: "No token provided." });
  }
  let token = authStr.trim().replace("Bearer", "").trimStart();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.locals.user = decoded;
    next();
  } catch (err: any) {
    // console.log(err);
    return res.status(401).send({ message: "Unauthorized!" });
  }
};

export const needAuth = authMiddleware;
