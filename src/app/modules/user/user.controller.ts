import type { Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../helpers/sendResponse";

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUsers();
    sendResponse(res, {
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
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

export const userControllers = {
  getUsers,
};
