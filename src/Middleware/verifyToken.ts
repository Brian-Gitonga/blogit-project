import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthRequest = Request & { user?: { id: string } };

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authToken = req.cookies.authToken;
  if (!authToken) {
    return res.status(401).json({ error: "Access denied. please login." });
  }
  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET!);
    req.user = decoded as { id: string };
    next();
  } catch (error) {
    res.status(401).json({ error: "Access denied. please login." });
  }
}


// import { type Request, type Response, type NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export type AuthRequest = Request & { user?: { id: string } };

// export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
//   const token = req.cookies.authToken;

//   if (!token) {
//     return res.status(401).json({ error: "Access denied. please login." });
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//   req.user = decoded as { id: string };
//   next();
// };

/*

*/
