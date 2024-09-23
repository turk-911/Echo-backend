import Post from "../models/Post";
import User from "../models/User";
import { Request, Response } from "express";
export const createPost = async (req: Request, res: Response) => {
    try {
        const { userId, description, picture } = req.body;
        const user = await User.findById(userId);
        if(!user) return res.status(400).json({ message: 'Message from create post: User not found' });
        const newPost = new Post({
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicture: user.picture,
            picture,
            likes: {},
            comments: {},
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ message: "Error in post.ts, create post" });
    }
}
export const getFeedPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ message: "Error in post.ts, could not find feed posts" });
    }
};
export const getUserPosts = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        if(!post) return res.status(400).json({ message: "Error in post.ts, could not find post" });
        const isLiked = post.likes?.get(userId);
        if(isLiked) post.likes?.delete(userId);
        else post.likes?.set(userId, true);
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true },
        );
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: "Error in post.ts, could not get user posts" });
    }
}