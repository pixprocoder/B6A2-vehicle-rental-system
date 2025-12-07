import { Request, Response } from "express";
import sendResponse from "../../helpers/sendResponse";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    const bookingData = req.body;

    const result = await bookingServices.createBooking(
      currentUser,
      bookingData
    );

    sendResponse(res, {
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;

    const result = await bookingServices.getBookings(currentUser);

    sendResponse(res, {
      success: true,
      message: "Bookings retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getBookings,
};
