import { Router, Request, Response } from "express";
import { signUp, signIn } from "../controllers/user";
const router = Router();

/* GET home page. */
router.get("/", (req: Request, res: Response) => {
  res.send("index");
});

router.post("/signup", signUp);
router.post("/signin", signIn);

export default router;
