import { Router } from "express";
import {
  postProposer,
  getProposer,
  putUserProposer,
  deleteUserProposer,
} from "../controllers/proposer";
import { needAuth } from "../middleware/needAuth";
import { handleErrorAsync } from "../service/handleErrorAsync";

const router = Router();

//不用登入取得提案人資料？
router.get("", needAuth, handleErrorAsync(getProposer));
router.post("", needAuth, handleErrorAsync(postProposer));
router.put("/:id", needAuth, handleErrorAsync(putUserProposer));
router.delete("/:id", needAuth, handleErrorAsync(deleteUserProposer));


export default router;
