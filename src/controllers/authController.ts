import { signInSchema } from "../validators/authValidator";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import prisma from "../lib/prisma";
import { generateToken } from "../lib/auth";
import type { Request, Response } from "express";

export const signIn = async (req: Request, res: Response) => {
  try {
    const validatedData = signInSchema.parse(req.body);

    const { email, password } = validatedData;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id, user.role);
    res.cookie("jwtToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({ message: "Signed in successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    console.error("Error in signIn:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("jwtToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("Error in signOut:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
