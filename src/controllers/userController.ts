import type { Request, Response } from "express";
import { signUpSchema } from "../validators/authValidator";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { userChangeSchema } from "../validators/userValidator";

export const createUser = async (req: Request, res: Response) => {
  try {
    const validatedData = signUpSchema.parse(req.body);

    const { name, email, password } = validatedData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.errors });
    }

    console.error("Error in signUp:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: { not: "ADMIN" },
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateAnyUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const validatedData = userChangeSchema.parse(req.body);
    const { email, name } = validatedData;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.email = email;
    user.name = name;
    await prisma.user.update({
      where: { id },
      data: user,
    });

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.errors });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const validatedData = userChangeSchema.parse(req.body);

    const { email, name } = validatedData;

    const id = req.user?.id;

    if (!id)
      return res.status(401).json({ message: "Unauthorized: Invalid token" });

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.errors });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAnyUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    await prisma.user.delete({ where: { id } });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.user?.id;

  try {
    await prisma.user.delete({ where: { id } });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
