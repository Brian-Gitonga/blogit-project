//get user blog using the id
import { type Request, type Response, type NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import type { AuthRequest } from "./verifyToken.js";

const client = new PrismaClient();

export const blog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { id } = req.params;
    const blog = await client.blog.findUnique({
      where: { id },
    });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json({ message: "Blog found", blog });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
