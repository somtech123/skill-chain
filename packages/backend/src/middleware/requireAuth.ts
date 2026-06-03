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

const cache = new Map();

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.slice(7);
  if (!token) return res.status(401).json({ error: "Missing token" });

  // check cache first (TTL: 5 minutes)
  if (cache.has(token)) {
    const { user, exp } = cache.get(token);
    if (Date.now() < exp) {
      req.user = user;
      return next();
    }
    cache.delete(token);
  }
  try {
    const ghRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "skill chain",
      },
    });

    if (!ghRes.ok) return res.status(401).json({ error: "Invalid token" });

    const ghUser = await ghRes.json();

    const user = {
      id: String(ghUser.id),
      login: ghUser.login,
      email: ghUser.email,
      githubConnected: true,
    };

    cache.set(token, { user, exp: Date.now() + 5 * 60 * 1000 }); // 5 min TTL
    req.user = user;
    next();
  } catch (err) {
    console.error("GitHub auth error:", err);
    return res.status(500).json({ error: "Auth check failed" });
  }
}
