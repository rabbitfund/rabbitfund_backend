import { Router, Request, Response } from "express";
import { signUp, login } from "../controllers/user";
import { handleErrorAsync } from "../service/handleErrorAsync";
import { needAuth } from "../middleware/needAuth";

const router = Router();

/* GET home page. */
router.get("/", (req: Request, res: Response) => {
  res.send("index");
});

router.post("/signup", handleErrorAsync(signUp));
//will be deprecated soon
router.post("/signin", handleErrorAsync(login));

router.post("/login", handleErrorAsync(login));

// 訂單相關
router.post("/ordesr", needAuth, handleErrorAsync(createOrder));

export default router;
