import type { NextFunction, Request, Response } from "express";

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user?.role)) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    next();
  };
};
