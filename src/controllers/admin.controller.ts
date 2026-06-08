import { Request, Response } from "express";
import Booking from "../models/booking.model";
import Room from "../models/room.model";

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { status, bookingType } = req.query;

    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (bookingType) {
      filter.bookingType = bookingType;
    }

    const bookings = await Booking.find(filter)
      .populate("userId", "name email employeeId")
      .populate("roomId", "name type")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching bookings",
    });
  }
};


export const approveBooking = async (
  req: Request,
  res: Response
) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "Booking already processed",
      });
    }

    const room = await Room.findById(
      booking.roomId
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Assigned room not found",
      });
    }

    if (
      booking.occupantCount >
      room.maxOccupancy
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Occupants exceed room capacity",
      });
    }

    const conflict = await Booking.findOne({
      _id: { $ne: booking._id },

      roomId: booking.roomId,

      status: "approved",

      checkinDate: {
        $lt: booking.checkoutDate,
      },

      checkoutDate: {
        $gt: booking.checkinDate,
      },
    });

    if (conflict) {
      console.log("CONFLICT",conflict);

      return res.status(402).json({
        success: false,
        message:
          "Room already booked for selected dates",
      });
    }

    
    booking.status = "approved";

    booking.adminRemarks = "Approved";

    // mark the room as not available once booking is approved
    room.isAvailable = false;
    await room.save();

    await booking.save();

    return res.status(200).json({
      success: true,
      message:
        "Booking approved successfully",
      booking,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        "Error approving booking",
    });
  }
};



export const rejectBooking = async (
  req: Request,
  res: Response
) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Booking already processed",
      });
    }

    const { reason } = (req as any).body;

    booking.status = "rejected";

    // if admin provided a reason, save it in adminRemarks so user can see it
    if (reason && typeof reason === "string" && reason.trim().length > 0) {
      booking.adminRemarks = reason.trim();
    } else {
      booking.adminRemarks = "Rejected";
    }

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      booking,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        "Error rejecting booking",
    });
  }
};