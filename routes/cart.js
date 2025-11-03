import express from "express";
import Cart from "../models/Cart.js";
import Item from "../models/Item.js";
import User from "../models/User.js";

const router = express.Router();


// create cart if not exist + return cart
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if(!cart){
    cart = await Cart.create({ userId, items:[] });
    await User.findByIdAndUpdate(userId,{ cartId:cart._id });
  }
  return cart;
}


// ADD item to cart
router.post("/add", async (req,res)=>{
  try{
    const { userId, itemId } = req.body;

    const cart = await getOrCreateCart(userId);

    const index = cart.items.findIndex(i => String(i.itemId) === itemId);

    if(index >= 0){
      // exists → increase qty
      cart.items[index].qty += 1;
    }else{
      // new push
      cart.items.push({ itemId, qty:1 });
    }

    await cart.save();
    res.json({ msg:"added", cart });

  }catch(err){ console.log(err); res.status(500).json({msg:"server error"}); }
});


// REMOVE item from cart
router.post("/remove", async (req,res)=>{
  try{
    const { userId, itemId } = req.body;

    const cart = await getOrCreateCart(userId);

    cart.items = cart.items.filter(i => String(i.itemId) !== itemId);

    await cart.save();
    res.json({ msg:"removed", cart });

  }catch(err){ console.log(err); res.status(500).json({msg:"server error"}); }
});


// GET cart of user
router.get("/:userId", async (req,res)=>{
  try{
    const { userId } = req.params;
    const cart = await getOrCreateCart(userId);

    // populate items details
    await cart.populate("items.itemId");

    res.json(cart);

  }catch(err){ console.log(err); res.status(500).json({msg:"server error"}); }
});

// GENERIC UPDATE item in cart
router.patch("/update", async (req,res)=>{
  try{
    const { userId, itemId, updates } = req.body;
    // updates = { qty: 4 }  or { color: "black" }  or { size: "XL" }

    const cart = await getOrCreateCart(userId);

    const index = cart.items.findIndex(i => String(i.itemId) === itemId);

    if(index < 0){
      return res.status(404).json({ msg:"item not in cart" });
    }

    // apply updates to that item
    Object.keys(updates).forEach(key => {
      cart.items[index][key] = updates[key];
    });

    // special rule: if qty <= 0 remove item
    if(cart.items[index].qty !== undefined && cart.items[index].qty <= 0){
      cart.items = cart.items.filter(i => String(i.itemId) !== itemId);
    }

    await cart.save();
    res.json({ msg:"item updated", cart });

  }catch(err){
    console.log(err);
    res.status(500).json({ msg:"server error" });
  }
});

export default router;
