//login user in the database and also verify if the user is logged in
import { type Request, type Response, type NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const client = new PrismaClient();

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        const user = await client.user.findUnique({
          where: { username },
        });
        if (!user) {
          return res.status(400).json({ error: "Invalid login credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: "Invalid login credentials" });
        }
        const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress,
            username: user.username,
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "10h" });
        res.status(200).cookie("authToken", token).json(payload);
      } catch (error) {
        res.status(500).json({ error: "something went wrong trying to login" });
      }
}