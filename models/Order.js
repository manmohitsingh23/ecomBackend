import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  status : { 
    type:String, 
    enum:["PENDING","CONFIRMED","SHIPPED","DELIVERED","CANCELLED"],
    default:"PENDING"
  },
  address : { type:String, required:true },   // simple string (you told)
  
  items : [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref:"Item", required:true },
    qty: { type:Number, default:1 },
    priceAtTime: { type:Number, required:true } // lock price
  }],

  userId : { type: mongoose.Schema.Types.ObjectId, ref:"User", required:true },

  totalPrice : { type:Number, required:true }  // sum(qty * priceAtTime)
},{
  timestamps:true
});

export default mongoose.model("Order", orderSchema);

