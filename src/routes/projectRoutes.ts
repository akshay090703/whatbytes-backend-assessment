import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProject,
  getUserProjects,
  listProjects,
  updateProject,
} from "../controllers/projectController";
import { authenticateUser } from "../middlewares/authenticateUser";
import { authorizeRole } from "../middlewares/authorizeRole";

const router = Router();

// Admin actions
router.get("/all", authenticateUser, authorizeRole(["ADMIN"]), listProjects);

router.post("/", authenticateUser, createProject);
router.get("/:id", authenticateUser, getProject);
router.get("/", authenticateUser, getUserProjects);
router.put("/:id", authenticateUser, updateProject);
router.delete("/:id", authenticateUser, deleteProject);

export default router;
