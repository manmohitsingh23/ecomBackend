import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:       { type:String, required:true },
  phone:      { type:String, required:true },
  email:      { type:String, required:true, unique:true },
  password:   { type:String, required:true },
  address:    { type:String, required:true },               // plain string: "Near Patel Market, Surat"
  isAdmin:    { type:Boolean, default:false },

  cartId:     { type: mongoose.Schema.Types.ObjectId, ref:"Cart" }, // 1 user -> 1 cart
  orderIds:   [{ type: mongoose.Schema.Types.ObjectId, ref:"Order" }] // user may have many orders
},{
  timestamps:true
});

export default mongoose.model("User", userSchema);

