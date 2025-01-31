import type { Request, Response } from "express";
import prisma from "../lib/prisma";

export const filterTasks = async (req: Request, res: Response) => {
  const { status, assignedUserId, skip = 0, take = 10 } = req.query;

  try {
    if (assignedUserId) {
      const assignedUser = await prisma.user.findUnique({
        where: {
          id: assignedUserId as string,
        },
      });

      if (!assignedUser) {
        return res.status(404).json({ message: "Assigned user not found" });
      }
    }

    if (
      status &&
      status !== "TODO" &&
      status !== "IN_PROGRESS" &&
      status !== "DONE"
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (assignedUserId) {
      filter.assignedUserId = assignedUserId;
    }

    const skipNumber = Number(skip);
    const takeNumber = Number(take);

    const tasks = await prisma.task.findMany({
      where: filter,
      include: {
        project: true,
        assignedUser: true,
      },
      skip: skipNumber,
      take: takeNumber,
    });

    const totalTasks = await prisma.task.count({
      where: filter,
    });

    const totalPages = Math.ceil(totalTasks / takeNumber);
    const currentPage = Math.floor(skipNumber / takeNumber) + 1;

    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
      pagination: {
        totalTasks,
        totalPages,
        currentPage,
        tasksPerPage: takeNumber,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Task fetching failed" });
  }
};
