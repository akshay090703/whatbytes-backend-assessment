import { Router } from "express";
import { filterTasks } from "../controllers/filterController";
import { authenticateUser } from "../middlewares/authenticateUser";

const router = Router();

// Endpoint: GET /tasks?status=IN_PROGRESS&assignedUserId=uuid&skip=0&take=10
router.get("/tasks", authenticateUser, filterTasks);

export default router;
