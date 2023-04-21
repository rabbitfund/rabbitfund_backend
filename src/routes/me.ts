import { Router } from "express";
import { updateMeUser, getMeUser } from "../controllers/user";
import { needAuth } from "../middleware/needAuth";

const router = Router();

router.put("/user", needAuth, updateMeUser);
router.get("/user", needAuth, getMeUser);

export default router;
