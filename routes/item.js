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

// get single item by id
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: "item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ msg: "server error" });
  }
});

// query based filtering /category?c=shoes
router.get("/category/:cat", async (req, res) => {
  try {
    const data = await Item.find({ category: req.params.cat });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "server error" });
  }
});

// search ?q=nike
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    const data = await Item.find({
      title: { $regex: q, $options: "i" }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "server error" });
  }
});

// update item (admin)
router.put("/:id", async (req, res) => {
  try {
    const { userId, ...rest } = req.body;
    const adminUser = await User.findById(userId);
    if (!adminUser || !adminUser.isAdmin)
      return res.status(403).json({ msg: "not allowed" });

    const updated = await Item.findByIdAndUpdate(req.params.id, rest, { new:true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "server error" });
  }
});

// delete item (admin)
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    const adminUser = await User.findById(userId);
    if (!adminUser || !adminUser.isAdmin)
      return res.status(403).json({ msg: "not allowed" });

    await Item.findByIdAndDelete(req.params.id);
    res.json({ msg: "item deleted" });
  } catch (err) {
    res.status(500).json({ msg: "server error" });
  }
});

export default router;
