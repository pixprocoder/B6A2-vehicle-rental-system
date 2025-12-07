import type { Request, Response } from "express";
import sendResponse from "../../helpers/sendResponse";
import { vehicleServices } from "./vehicle.service";

const addVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.addVehicle(req.body);
    sendResponse(res, {
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.log(error);
    sendResponse(res, {
      success: false,
      message: error?.message ? error?.message : "Internal Server Error",
      data: null,
    });
  }
};

export const vehicleControllers = {
  addVehicle,
};
