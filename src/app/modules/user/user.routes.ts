import express from "express";
import { ROLE } from "../../../enum";
import auth from "../../middleware/auth";
import { userControllers } from "./user.controller";

const router = express.Router();

router.get("/", auth(ROLE.ADMIN), userControllers.getUsers);

export const userRoutes = router;
