//create a blog middleware per the logged in user
import { type Request, type Response, type NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import type { AuthRequest } from "./verifyToken.js";

const client = new PrismaClient();

export const createBlog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, synopsis, featuredImageUrl, content } = req.body;
    const { id } = req.user!;
    const blog = await client.blog.create({
      data: {
        title,
        synopsis,
        featuredImageUrl,
        content,
        userId: id,
      },
    });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
