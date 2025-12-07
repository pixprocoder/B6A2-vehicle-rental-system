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

const updateUser = async (req: Request, res: Response) => {
  try {
    const targetedUserId = req.params.userId;
    const currentUser = req.user;
    const updateData = req.body;

    const result = await userServices.updateUser(
      targetedUserId!,
      currentUser!,
      updateData
    );
    sendResponse(res, {
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      success: false,
      message: error?.message ? error?.message : "Internal Server Error",
      data: null,
    });
  }
};

export const userControllers = {
  getUsers,
  updateUser,
};
