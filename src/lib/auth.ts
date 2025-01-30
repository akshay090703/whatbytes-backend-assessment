import type { Request } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const getDataFromRequest = (req: Request) => {
  const token = req.cookies?.jwtToken;
  if (!token) return null;

  try {
    const decoded = verifyToken(token);

    return decoded;
  } catch (error) {
    return null;
  }
};
