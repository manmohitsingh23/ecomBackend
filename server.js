// src/server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/item.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";



const app = express();
app.use(express.json());

app.use(cors());

// DB CONNECT
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ MongoDB connected");
})
.catch((err) => {
  console.log("❌ DB error:", err);
});

// ROUTES
app.use("/auth", authRoutes);
app.use("/item", itemRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

// ROOT CHECK
app.get("/", (req,res)=>{
  res.send("Ecommerce API running");
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
