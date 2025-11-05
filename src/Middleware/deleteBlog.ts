//we will fetch Id and then we delete that blog permanently
import { type Request, type Response, type NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import type { AuthRequest } from "./verifyToken.js";

const client = new PrismaClient();

export const deleteBlog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "please login to delete a blog" });
    }
    const { id } = req.params;
    const blog = await client.blog.delete({
      where: { id },
    });
    res.status(200).json({ message: "Your Blog has been deleted successfully", blog });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
