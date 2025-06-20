import { Router } from 'express';

import {
  getUsers,
  createUser,
  getUserByParams,
  deleteUser,
  updateUser,
  getUser,
} from "../controller/users.controller.js";

const router = Router();

router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.post("/user", createUser);
router.post("/user/byparams", getUserByParams);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

export default router;
