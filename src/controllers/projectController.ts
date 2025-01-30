import type { Request, Response } from "express";
import {
  projectSchema,
  updateProjectSchema,
} from "../validators/projectValidator";
import { ZodError } from "zod";
import prisma from "../lib/prisma";

export const createProject = async (req: Request, res: Response) => {
  try {
    const validatedData = projectSchema.parse(req.body);

    const { name, description } = validatedData;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const project = await prisma.project.create({
      data: { name, description, userId },
    });
    return res.status(201).json(project);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany();
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch projects" });
  }
};

export const getProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) return res.status(404).json({ message: "Project not found" });

    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch project" });
  }
};

export const getUserProjects = async (req: Request, res: Response) => {
  try {
    const id = req.user?.id;

    if (!id) {
      return res.status(404).json({ message: "User not found" });
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: id,
      },
    });

    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch projects" });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const validatedData = updateProjectSchema.parse(req.body);
    const { name, description, status } = validatedData;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.name = name;
    project.description = description;
    project.status = status;

    await prisma.project.update({
      where: { id },
      data: project,
    });

    return res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Project update failed" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await prisma.project.delete({ where: { id } });
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Project deletion failed" });
  }
};
