import express from "express";
import {
createRoom,
getRooms,
} from "../controllers/room.controller";
import { uploadRoomImages } from "../config/cloudinary";
// import authMiddleware from "../middlewares/auth.middleware";
const router = express.Router();

// router.post("/create",createRoom);

router.post("/create", uploadRoomImages.array("images", 5), createRoom);

router.get("/", getRooms);

export default router;