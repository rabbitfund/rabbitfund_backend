import { Router } from "express";
import {
  postOwnerProjects,
  getOwnerProjects,
  getOwnerProject,
  putOwnerProject,
  deleteOwnerProject,
  getOwnerProjectOptions,
  postOwnerProjectOptions,
  patchProjectOptions,
  getProjectSupporters,
} from "../controllers/project";
import { needAuth } from "../middleware/needAuth";
import { handleErrorAsync } from "../service/handleErrorAsync";

const router = Router();

router.get("", needAuth, handleErrorAsync(getOwnerProjects)); // TODO
router.post("", needAuth, handleErrorAsync(postOwnerProjects));
router.get("/:pid", needAuth, handleErrorAsync(getOwnerProject));
router.put("/:pid", needAuth, handleErrorAsync(putOwnerProject));
router.delete("/:pid", needAuth, handleErrorAsync(deleteOwnerProject));

router.get("/:pid/options", needAuth, handleErrorAsync(getOwnerProjectOptions));
router.post(
  "/:pid/options",
  needAuth,
  handleErrorAsync(postOwnerProjectOptions)
);
router.patch(
  "/:pid/options/:optid",
  needAuth,
  handleErrorAsync(patchProjectOptions)
);

// B2, GET, /owner/projects
// B1, POST, /owner/projects
// B3, GET, /owner/projects/{pid}
// B4, PUT, /owner/projects/{pid}
// B5, DELETE, /owner/projects/{pid}

// B7, GET, /owner/projects/{pid}/options
// B6, POST, /owner/projects/{pid}/options

// ---
// B8, PUT, /owner/projects/{pid}/options
// B9, PATCH, /owner/projects/{pid}/options/{optId}
// B10, GET, /owner/projects/{pid}/supporters
router.get(
  "/:pid/supporters",
  needAuth,
  handleErrorAsync(getProjectSupporters)
);
// B11, GET, /owner/projects/{pid}/status

export default router;
