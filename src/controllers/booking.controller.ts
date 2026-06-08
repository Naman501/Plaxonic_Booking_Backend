import { Response } from "express";
import Booking from "../models/booking.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import roomModel from "../models/room.model";





export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const {
      bookingType,
      checkinDate,
      checkoutDate,
      occupantCount,
      members,
      purpose,
      roomId
    } = req.body;
    if (!bookingType || !checkinDate || !checkoutDate || !occupantCount || !roomId) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory",
      });
    }
    const validBookingTypes = ["individual", "team", "family"];
    if (!validBookingTypes.includes(bookingType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking type",
      });
    }
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const today = new Date();
    if (checkin >= checkout) {
      return res.status(400).json({
        success: false,
        message: "Checkout must be after checkin",
      });
    }
    if (checkin < today) {
      return res.status(400).json({
        success: false,
        message: "Past booking not allowed",
      });
    }
    if (bookingType === "team") {
      if (!members || members.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Team members required",
        });
      }
    }


const pendingBookings = await Booking.find({
  roomId,

  status: "pending",

  checkinDate: {
    $lt: checkout,
  },

  checkoutDate: {
    $gt: checkin,
  },
});


const hasPendingRequests =
  pendingBookings.length > 0;



    const booking = await Booking.create({
      userId: req.user.id,
      bookingType,
      checkinDate: checkin,
      checkoutDate: checkout,
      occupantCount,
      members: members || [],
      purpose,
      status: "pending",
      roomId
    });
    return res.status(201).json({
      success: true,
      // message: "Booking request created successfully",
        message:
    hasPendingRequests
      ? "Room already has pending requests"
      : "Booking request created successfully",
      booking,
       hasPendingRequests,
  pendingCount: pendingBookings.length
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in creating a booking request",
    });
  }
};



export const checkPendingRequests = async (
  req: Request<{ roomId: string }>,
  res: Response
) => {
  try {
    const pendingCount = await Booking.countDocuments({
      roomId: req.params.roomId,
      status: "pending",
    })

    res.json({
      hasPendingRequests: pendingCount > 0,
      pendingCount,
    })
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    })
  }
}


export const myBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.id,
    })
      .populate("roomId", "name type")
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Error fetching bookings",
    })
  }
};

// export const cancelBooking = async (req: AuthRequest, res: Response) => {
//   try {
//     const bookingId = req.params.id
//     const booking = await Booking.findById(bookingId)

// console.log("Booking",booking)

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       })
//     }

//     if (booking.userId.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized access",
//       })
//     }

//     booking.status = "cancelled"
//     await booking.save()
//     return res.status(200).json({
//       success: true,
//       message: "Booking cancelled successfully",
//     })
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Error in cancelling booking.",
//     })
//   }
// };

export const cancelBooking = async (req:any,res:any) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: "A rejection reason is required" });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status: "cancelled",
        cancellationReason: reason.trim(),
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ booking });
  } catch (error) {
    return res.status(500).json({ message: "Failed to reject booking" });
  }
};




export const checkAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "From and To dates required",
      });
    }
    
    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);

    if (fromDate >= toDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range",
      });
    }

    const conflictingBookings = await Booking.find({
      status: "approved",
      checkinDate: {
        $lt: toDate,
      },
      checkoutDate: {
        $gt: fromDate,
      },
    });

    const bookedRoomIds = conflictingBookings.map((booking) => booking.roomId);

    const availableRooms = await roomModel.find({
      _id: {
        $nin: bookedRoomIds,
      },
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      count: availableRooms.length,
      availableRooms,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error checking availability",
    });
  }
};
