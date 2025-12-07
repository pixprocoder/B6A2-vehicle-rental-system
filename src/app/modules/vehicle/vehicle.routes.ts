import express from "express";
import { ROLE } from "../../../enum";
import auth from "../../middleware/auth";
import { vehicleControllers } from "./vehicle.controller";

const router = express.Router();

router.post("/", auth(ROLE.ADMIN), vehicleControllers.addVehicle);
router.get("/", vehicleControllers.getVehicles);
router.get("/:vehicleId", vehicleControllers.getSingleVehicle);
router.put("/:vehicleId", auth("admin"), vehicleControllers.updateVehicle);

export const vehicleRoutes = router;
