// import mongoose, { Schema, Document } from "mongoose";

// export interface IRoom extends Document {
//   name: string;
//   type: "1bhk" | "2bhk";
//   maxOccupancy: number;
//   isAvailable: boolean;
// }

// const roomSchema = new Schema<IRoom>({
//   name: String,
//   type: {
//     type: String,
//     enum: ["1bhk", "2bhk"],
//   },
//   maxOccupancy: {
//     type: Number,
//   },

//   isAvailable: {
//     type: Boolean,
//     default: true,
//   },
// });

// export default mongoose.model<IRoom>("Room", roomSchema);


import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  type: string;
  maxOccupancy: number;
  isAvailable: boolean;
  description: string;        // new
  amenities: string[];        // new
  images: string[];           // new — Cloudinary URLs
}

const RoomSchema = new Schema<IRoom>(
  {
    name:          { type: String, required: true },
    type:          { type: String, required: true },
    maxOccupancy:  { type: Number, required: true },
    isAvailable:   { type: Boolean, default: true },
    description:   { type: String, default: "" },       // new
    amenities:     { type: [String], default: [] },     // new
    images:        { type: [String], default: [] },     // new
  },
  { timestamps: true }
);

export default mongoose.model<IRoom>("Room", RoomSchema);