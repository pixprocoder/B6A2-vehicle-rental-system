import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
import { ROLE } from "../../../enum";

const router = express.Router();

router.get("/", auth(ROLE.ADMIN), userControllers.getUsers);

export const userRoutes = router;
