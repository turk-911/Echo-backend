import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.JWT_SECRET;
export const register = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password, picture, friends, location, occupation } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picture,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 100),
            impressions: Math.floor(Math.random() * 100),
        }); 
        const savedUser = await newUser.save();
    } catch (error) {
        res.status(500).json({ error: 'Some error occured in auth.ts, in register route' });
    }
}
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if(!user) return res.status(400).json({ message: 'User not found, register first '});
        const verdict = await bcrypt.compare(password, user.password);
        if(!verdict) return res.status(400).json({ message: 'Credentials are not valid '});
        const token = jwt.sign({ id: user._id }, secret as string);
    } catch (error) {
        res.status(500).json({ error: 'Some error occured in auth.ts, in login route '});
    }
}