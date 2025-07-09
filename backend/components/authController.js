import dotenv from 'dotenv';
dotenv.config(); 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
const JWT_SECRET = process.env.JWT_SECRET;
export const register= async (req, res)=>{
    const{username,email,password} = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if(existingUser){
            res.status(500).json({ msg: "User already exists" });
       }
       const hashedPassword = await bcrypt.hash(password, 10);
      const createNewUser = new User({
      username,
      email,
      password: hashedPassword
    });
       await createNewUser.save();
        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
         console.error("Register error:", err);
         res.status(500).json({ msg: "Server error", error: err.message });
    }

}

export const login= async(req,res)=>{
   const{email,password} = req.body;
   try {
   const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
   res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
     }
