import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser";
import {
  listUsers,
  updateAnyUser,
  updateUser,
  deleteAnyUser,
  deleteUser,
  getUser,
} from "../controllers/userController";
import { authorizeRole } from "../middlewares/authorizeRole";

const router = Router();

// Admin actions only
router.put("/:id", authenticateUser, authorizeRole(["ADMIN"]), updateAnyUser);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole(["ADMIN"]),
  deleteAnyUser
);

router.get("/", authenticateUser, listUsers);
router.put("/", authenticateUser, updateUser);
router.delete("/", authenticateUser, deleteUser);
router.get("/", authenticateUser, getUser);

export default router;
