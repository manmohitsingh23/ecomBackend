import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Item from "../models/Item.js";

const router = express.Router();

// CHECKOUT – convert cart → order
router.post("/checkout", async (req,res)=>{
  try{
    const { userId, address } = req.body;

    // 1) get cart
    const cart = await Cart.findOne({ userId });
    if(!cart || cart.items.length===0)
      return res.status(400).json({ msg:"cart empty" });

    // 2) calculate total from DB (priceCalc = 1)
    let total = 0;
    let orderItems = [];

    for(const c of cart.items){
      const item = await Item.findById(c.itemId);

      if(!item) continue;

      const priceAtTime = item.price * c.qty;
      total += priceAtTime;

      orderItems.push({
        itemId: item._id,
        qty: c.qty,
        price: item.price
      });
    }

    // 3) create order
    const order = await Order.create({
      userId,
      items: orderItems,
      price: total,
      address,
      status: "pending"
    });

    // 4) empty cart
    cart.items = [];
    await cart.save();

    res.json({ msg:"order created", orderId: order._id, totalPrice: total });

  }catch(err){
    console.log(err);
    res.status(500).json({ msg:"server error" });
  }
});

// get order list of user
router.get("/:userId", async (req,res)=>{
  const { userId } = req.params;
  const orders = await Order.find({ userId }).sort({createdAt:-1});
  res.json(orders);
});

export default router;
