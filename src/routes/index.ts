import { Router, Request, Response } from "express";
import { signUp, login } from "../controllers/user";
import { handleErrorAsync } from "../service/handleErrorAsync";

const router = Router();

/* GET home page. */
router.get("/", (req: Request, res: Response) => {
  res.send("index");
});

router.post("/signup", handleErrorAsync(signUp));
//will be deprecated soon
router.post("/signin", handleErrorAsync(login));

router.post("/login", handleErrorAsync(login));

export default router;
