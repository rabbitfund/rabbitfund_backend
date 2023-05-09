import { Router } from "express";
import { updateMeUser, getMeUser } from "../controllers/user";
import { needAuth } from "../middleware/needAuth";
import { handleErrorAsync } from "../service/handleErrorAsync";
import { createMeLikes, getMeLikes, deleteMeLikes } from "../controllers/likes";

const router = Router();

//will be deprecated soon
router.get("/user", needAuth, handleErrorAsync(getMeUser));
//will be deprecated soon
router.put("/user", needAuth, handleErrorAsync(updateMeUser));

router.get("/profile", needAuth, handleErrorAsync(getMeUser));
router.put("/profile", needAuth, handleErrorAsync(updateMeUser));

// 會員收藏專案
router.post("/likes", needAuth, handleErrorAsync(createMeLikes));
router.get("/likes", needAuth, handleErrorAsync(getMeLikes));
router.delete("/likes/:pid", needAuth, handleErrorAsync(deleteMeLikes));

export default router;
