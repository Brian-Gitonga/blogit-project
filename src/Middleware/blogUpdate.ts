//updating a blog
import { type Request, type Response, type NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import type { AuthRequest } from "./verifyToken.js";

const client = new PrismaClient();

export const blogUpdate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { id } = req.params;
    const { title, synopsis, featuredImageUrl, content } = req.body;
    const blog = await client.blog.update({
      where: { id },
      data: {
        title,
        synopsis,
        featuredImageUrl,
        content,
      },
    });
    res.status(200).json({ message: "Your blog updated successfully", blog });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
