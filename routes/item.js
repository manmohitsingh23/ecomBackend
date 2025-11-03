import express from "express";
import Item from "../models/Item.js";
import User from "../models/User.js";

const router = express.Router();

// BULK create items (ADMIN ONLY)
router.post("/bulk", async (req, res) => {
  try {
    const { userId, items } = req.body;

    // check admin
    const adminUser = await User.findById(userId);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ msg: "not allowed" });
    }

    // create many
    const created = await Item.insertMany(items);

    res.json({ msg: "items created", count: created.length });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "server error" });
  }
});

// get all items
router.get("/", async (req,res)=>{
  const data = await Item.find();
  res.json(data);
});

export default router;
