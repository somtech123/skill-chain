import { Request, Response, NextFunction } from "express";
import { getToken } from "next-auth/jwt";

export {};

// Extend Express Request to carry the decoded user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        githubConnected: boolean;
      };
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // next-auth/jwt can decode the cookie from an Express request
  // as long as NEXTAUTH_SECRET matches your Next.js app
  try {
    const token = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    if (!token || !token.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!token.githubConnected) {
      return res.status(403).json({ error: "GitHub not connected" });
    }
    req.user = {
      id: token.sub,
      githubConnected: !!token.githubConnected,
    };

    next();
  } catch (e) {
    console.error("Auth middleware error:", e);
    return res.status(401).json({ error: "Unauthorized" });
  }
}
