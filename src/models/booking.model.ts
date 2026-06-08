import mongoose,{Schema,Document,Types} from "mongoose";

interface Member {
  name:string;
  email:string;
}

export interface IBooking extends Document {
  userId:Types.ObjectId;
  roomId:Types.ObjectId | null;
  bookingType:"individual" | "team" | "family";
  checkinDate:Date;
  checkoutDate:Date;
  status:"pending" | "approved" | "rejected" | "cancelled";
  occupantCount:number;
  members:Member[];
  purpose:string;
  adminRemarks:string;
}

const bookingSchema = new Schema<IBooking>({
  userId:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },

  roomId:{
    type:Schema.Types.ObjectId,
    ref:"Room",
    default:null
  },

  bookingType:{
    type:String,
    enum:["individual","team","family"]
  },

  checkinDate:{type:Date},

  checkoutDate:{type:Date},

  status:{
    type:String,
    enum:["pending","approved","rejected","cancelled"],
    default:"pending"
  },

  occupantCount: {
      type: Number,
      required: true,
    },


 members: [
    {
      employeeId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
  ],

    purpose: {
      type: String,
    },

    adminRemarks: {
      type: String,
    },
},{timestamps:true});

export default mongoose.model<IBooking>("Booking",bookingSchema);