//fetch all blogs from our datbase
import { type Request, type Response, type NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const allBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogs = await client.blog.findMany();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
