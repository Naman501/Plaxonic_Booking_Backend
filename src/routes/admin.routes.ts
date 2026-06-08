import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import requireRole from "../middlewares/role.middleware";
import {
getAllBookings,
approveBooking,
rejectBooking,
} from "../controllers/admin.controller";

const router = express.Router();

router.get(
"/bookings",
authMiddleware,
requireRole("admin"),
getAllBookings
);

router.patch(
"/bookings/approve/:id",
authMiddleware,
requireRole("admin"),
approveBooking
);

router.patch(
"/bookings/reject/:id",
authMiddleware,
requireRole("admin"),
rejectBooking
);

export default router;