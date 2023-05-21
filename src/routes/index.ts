import { Router, Request, Response } from "express";
import { signUp, login } from "../controllers/user";
import { createOrder, checkOrder, orderReturn, orderNotify } from "../controllers/order";
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
router.post("/orders", needAuth, handleErrorAsync(createOrder));
router.get("/order/:orderid", needAuth, handleErrorAsync(checkOrder));
router.post("/orders/return", needAuth, handleErrorAsync(orderReturn));
router.post("/orders/notify", needAuth, handleErrorAsync(orderNotify));

export default router;
