import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  createBooking,
  myBookings,
  cancelBooking,
  checkAvailability,
  checkPendingRequests,
} from "../controllers/booking.controller";
import { RequestHandler } from "express";

const router = express.Router();

router.post("/create", authMiddleware, createBooking);

router.get("/me", authMiddleware, myBookings);

router.delete("/cancel/:id", authMiddleware, cancelBooking);

router.get("/availability",checkAvailability);

router.get(
  "/check-pending/:roomId",
  checkPendingRequests as unknown as RequestHandler
)

export default router;
