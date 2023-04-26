import { Router } from "express";
import { updateMeUser, getMeUser } from "../controllers/user";
import { needAuth } from "../middleware/needAuth";
import { handleErrorAsync } from "../service/handleErrorAsync";

const router = Router();

//will be deprecated soon
router.get("/user", needAuth, handleErrorAsync(getMeUser));
//will be deprecated soon
router.put("/user", needAuth, handleErrorAsync(updateMeUser));

router.get("/profile", needAuth, handleErrorAsync(getMeUser));
router.put("/profile", needAuth, handleErrorAsync(updateMeUser));

export default router;
