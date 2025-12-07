import express from "express";
import { ROLE } from "../../../enum";
import auth from "../../middleware/auth";
import { vehicleControllers } from "./vehicle.controller";

const router = express.Router();

router.post("/", auth(ROLE.ADMIN), vehicleControllers.addVehicle);
router.get("/", vehicleControllers.getVehicles);

export const vehicleRoutes = router;
