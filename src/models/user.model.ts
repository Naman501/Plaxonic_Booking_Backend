import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  employeeId:string;
  name:string;
  email:string;
  password:string;
  role:"user" | "admin" |"superAdmin";
}

const userSchema = new Schema<IUser>({
  employeeId:{
    type:String,
    required:true,
    unique:true
  },
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    enum:["user","superAdmin","admin"],
    default:"user"
  }
},{
  timestamps:true
});

export default mongoose.model<IUser>("User",userSchema);