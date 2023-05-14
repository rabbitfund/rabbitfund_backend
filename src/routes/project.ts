import { Router } from "express";
import { getProject, getProjects, getProjectOptions } from "../controllers/project";
import { needAuth } from "../middleware/needAuth";
import { handleErrorAsync } from "../service/handleErrorAsync";

const router = Router();

router.get("", needAuth, handleErrorAsync(getProjects));
router.get("/:pid", needAuth, handleErrorAsync(getProject));
router.get("/:pid/options", needAuth, handleErrorAsync(getProjectOptions));


// S5, GET, /projects/{pid}
// S6, GET, /projects/{pid}/options
// S7, GET, /projects?type=<type>&k=<keyword>
// S4, GET, /projects?page={page}&tag={tag}

// ---
// S8, GET, /projects/{pid}/profile

export default router;