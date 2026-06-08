import { Request, Response } from "express";
import Room from "../models/room.model";

// export const createRoom = async (
//   req: Request,
//   res: Response
// ) => {

//   try {
//     const {
//       name,
//       type,
//       maxOccupancy
//     } = req.body;

//     if(
//       !name ||
//       !type ||
//       !maxOccupancy
//     ){
//       return res.status(400).json({
//         success:false,
//         message:"All fields are required"
//       });
//     }

//     const validRoomTypes = [
//       "1bhk",
//       "2bhk"
//     ];
//     if(!validRoomTypes.includes(type)){
//       return res.status(400).json({
//         success:false,
//         message:"Invalid room type"
//       });
//     }

//     if(maxOccupancy <= 0){
//       return res.status(400).json({
//         success:false,
//         message:"Max occupants must be greater than 0"
//       });
//     }
//     const existingRoom = await Room.findOne({
//       name
//     });
//     if(existingRoom){
//       return res.status(400).json({
//         success:false,
//         message:"Room already exists"
//       });
//     }

//     const room = await Room.create({
//       name,
//       type,
//       maxOccupancy,
//     //   isAvailalbe:true
//     });
//     return res.status(201).json({
//       success:true,
//       message:"Room created successfully",
//       room
//     });
//   } catch (error) {

//     console.log(error);
//     return res.status(500).json({
//       success:false,
//       message:"Error creating room"
//     });
//   }
// };

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name, type, maxOccupancy, description, amenities } = req.body;
console.log(name)
    if (!name || !type || !maxOccupancy) {
      return res.status(400).json({ message: "name, type and maxOccupancy are required" });
    }

    // multer-storage-cloudinary puts uploaded files in req.files
    const files = (req.files as Express.Multer.File[]) ?? [];
    // Each file has a `path` property which is the Cloudinary secure URL
    const imageUrls = files.map((f) => f.path);

    // FormData sends repeated keys as either a string or string[]
    const parsedAmenities: string[] = Array.isArray(amenities)
      ? amenities
      : amenities
      ? [amenities]
      : [];

    const room = await Room.create({
      name,
      type,
      maxOccupancy: Number(maxOccupancy),
      description:  description ?? "",
      amenities:    parsedAmenities,
      images:       imageUrls,
    });

    return res.status(201).json({ room });
  } catch (error) {
    console.error("createRoom error:", error);
    return res.status(500).json({ message: "Failed to create room" });
  }
};

export const getRooms = async (
  req: Request,
  res: Response
) => {

  try {
    const {
      type,
      isAvailable
    } = req.query;

    const filter:any = {};

    if(type){
      filter.type = type;
    }

    if(isAvailable !== undefined){
      filter.isAvailable = isAvailable === "true";
    }

    const rooms = await Room.find(filter)
    .sort({
      createdAt:-1
    });
    console.log(rooms,"ROOMS")
    return res.status(200).json({
      success:true,
      count:rooms.length,
      rooms
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Error fetching rooms"
    });
  }
};