import { Request, Response, NextFunction } from "express";
import jwt, { JwtHeader, JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
interface IUser {
    id: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const secret = process.env.JWT_SECRET;
        if(!secret) throw new Error("Jwt secret is not defined");
        let token: any = req.header("Authorization");
        if(!token) res.status(403).json({ message: "Access denied" });
        if(token?.startsWith("Bearer ")) token = token.slice(7, token.length).trimStart();
        const verified = jwt.verify(token, secret) as JwtPayload;
        if(typeof verified === 'object' && verified.id) {
            req.user = { id: verified.id };
            next();
        }
        else res.status(404).send("Invalid token");
    } catch (error) {
        res.status(500).json({ message: "Error in middleware/index.ts" });
    }
}