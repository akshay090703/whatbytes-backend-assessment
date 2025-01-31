import type { Request, Response } from "express";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/taskValidator";
import prisma from "../lib/prisma";

export const createTask = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return res.status(400).json({ message: "Project not found" });
    }

    const validatedData = createTaskSchema.parse(req.body);

    const { title, description, assignedUserId } = validatedData;

    const assignedUser = await prisma.user.findUnique({
      where: {
        id: assignedUserId,
      },
    });

    if (!assignedUser) {
      return res.status(400).json({ message: "Assigned user not found" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assignedUserId,
      },
    });

    return res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Task creation failed" });
  }
};

export const listTasksForProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return res.status(400).json({ message: "Project not found" });
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
      },
    });

    return res
      .status(200)
      .json({ message: "Tasks fetched successfully", tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Task fetching failed" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const validatedData = updateTaskSchema.parse(req.body);

    const { title, description, assignedUserId, status } = validatedData;

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title,
        description,
        assignedUserId,
        status,
      },
    });

    return res
      .status(200)
      .json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Task update failed" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Task deletion failed" });
  }
};
