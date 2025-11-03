import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, phone, email, password, address } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "email already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      email,
      password: hash,
      address
    });

    res.json({ msg: "user created", userId: user._id });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "server error" });
  }
});

// LOGIN
router.post("/login", async (req,res)=>{
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if(!user) return res.status(400).json({ msg:"invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({ msg:"invalid credentials" });

    res.json({ msg:"login success", userId: user._id });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg:"server error" });
  }
});

router.post("/adminSignup", async (req,res) => {
  try {
    const {name,phone,email, password,address} = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "email already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      email,
      password: hash,
      address,
      isAdmin: true,
    });

    res.json({ msg:"admin created", userId:user._id });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg:"server error" });
  }
});

export default router;
