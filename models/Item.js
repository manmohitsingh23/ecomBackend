import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name:            { type:String, required:true },
  description:     { type:String },

  size: {
    type:String,
    enum:["SMALL","MEDIUM","LARGE"],
    required:true
  },

  price:           { type:Number, required:true },

  category: { 
    type:String, 
    enum:["upperwear","bottomwear","shoes","watch","accessories"],
    required:true
  },

  wannaUrl:        { type:String },
  lensId:          { type:String },
  assetGroupId:    { type:String },
  assetModelId:    { type:String },

  imagesUrl:       [{ type:String }],

  deepARUrl:       { type:String },

  AR: {
    type:String,
    enum:["WANNA","LENS","DEEP"],
    required:true
  }
},{
  timestamps:true
});

export default mongoose.model("Item", itemSchema);

