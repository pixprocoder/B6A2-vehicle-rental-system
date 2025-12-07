import express from "express";
import { vehicleControllers } from "./vehicle.controller";
import auth from "../../middleware/auth";
import { ROLE } from "../../../enum";

const router = express.Router();

router.post("/", auth(ROLE.ADMIN), vehicleControllers.addVehicle);

export const vehicleRoutes = router;
