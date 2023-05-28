import { Router } from "express";
import { getProject, getProjects, getProjectOptions, getProjectOption, updateTotalFundingAmount,getTotalFundingAmount } from "../controllers/project";
import { needAuth } from "../middleware/needAuth";
import { handleErrorAsync } from "../service/handleErrorAsync";

const router = Router();

router.get("", handleErrorAsync(getProjects));
router.get("/:pid", handleErrorAsync(getProject));
router.get("/:pid/options", handleErrorAsync(getProjectOptions));
router.get("/:pid/options/:optid", handleErrorAsync(getProjectOption));

router.patch("/amount/:pid", handleErrorAsync(updateTotalFundingAmount));
router.get("/amount/:pid", handleErrorAsync(getTotalFundingAmount));



// S5, GET, /projects/{pid}
// S6, GET, /projects/{pid}/options
// S7, GET, /projects?type=<type>&k=<keyword>
// S4, GET, /projects?page={page}&tag={tag}

// ---
// S8, GET, /projects/{pid}/profile

export default router;