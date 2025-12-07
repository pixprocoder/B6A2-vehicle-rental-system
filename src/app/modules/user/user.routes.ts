import express from "express";
import { ROLE } from "../../../enum";
import auth from "../../middleware/auth";
import { userControllers } from "./user.controller";

const router = express.Router();

router.get("/", auth(ROLE.ADMIN), userControllers.getUsers);
router.put("/:userId", auth(ROLE.ADMIN, ROLE.USER), userControllers.updateUser);
router.delete("/:userId", auth(ROLE.ADMIN), userControllers.deleteUser);

export const userRoutes = router;
