import User from "../models/User";
import { Request, Response } from "express";
import { Friend } from "../types";
export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: "Error in controllers/users.ts, could not find getUser" });
    }
}
export const getUserFriends = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user) return res.status(400).json({ message: "Error in controllers/users.ts, could not find user" });
        const friends = await Promise.all(
            user.friends.map((id: string) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({
                _id, 
                firstName,
                lastName,
                occupation,
                location,
                picture,
            }) => {
                return {
                    _id,
                    firstName,
                    lastName,
                    occupation,
                    location,
                    picture
                }
            }
        );
        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(400).json({ message: "Error in controllers/users.ts, could not find getUserFriends" });
    }
}
export const addRemoveFriends = async (req: Request, res: Response) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        if(!user) return res.status(404).json({ message: "User not found" });
        if(!friend) return res.status(404).json({ message: "Friend not found" });
        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend?.friends?.filter((id) => id !== id);
        }
        else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();
    } catch (error) {
        res.status(400).json({ message: "Error in controllers/users.ts, could not find addRemoveFriends"})
    }
}