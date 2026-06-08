import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import bookingRoutes from "./routes/booking.routes";  
import adminRoutes from "./routes/admin.routes";
import roomRoutes from "./routes/room.routes";


dotenv.config();

const app = express();


app.use(
  cors({
    origin:["http://localhost:3000","http://localhost:3001","https://plaxonic-booking-admin-panel.vercel.app","https://plaxonic-booking-user-panel.vercel.app"],
    credentials:true
  }))
  
  
app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/bookings", bookingRoutes);
app.use("/admin", adminRoutes);
app.use("/rooms", roomRoutes);

connectDB()

app.get('/',(req,res)=>{
    res.send("Hello")
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});