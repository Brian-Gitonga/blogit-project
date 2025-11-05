//putting blogs to trashed in the IsDeleted field to true
import { type Request, type Response, type NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import type { AuthRequest } from "./verifyToken.js";

const client = new PrismaClient();

export const blogTrash = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { id } = req.params;
    const blog = await client.blog.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
    res.status(200).json({ message: "Your Blog has been put into trash", blog });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
