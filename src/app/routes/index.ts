import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { userRoutes } from "../modules/user/user.routes";
import { vehicleRoutes } from "../modules/vehicle/vehicle.routes";
import { bookingRoutes } from "../modules/booking/booking.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/vehicles",
    route: vehicleRoutes,
  },
  {
    path: "/bookings",
    route: bookingRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
