import { Router } from "express";
import {
  createTask,
  deleteTask,
  listTasksForProject,
  updateTask,
} from "../controllers/taskController";
import { authenticateUser } from "../middlewares/authenticateUser";

const router = Router();

router.post("/:projectId/tasks", authenticateUser, createTask);
router.get("/:projectId/tasks", authenticateUser, listTasksForProject);
router.put("/:taskId", authenticateUser, updateTask);
router.delete("/:taskId", authenticateUser, deleteTask);

export default router;
