import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { AppError } from "../utils/app-error";

export async function listTasks(user?: Express.User) {
  const where: Prisma.TaskWhereInput = {};
  if (user?.role === "EMPLOYEE" && user.employeeId) {
    where.assignedTo = user.employeeId;
  }

  return prisma.task.findMany({
    where,
    include: { creator: true, assignee: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTask(data: Prisma.TaskUncheckedCreateInput, userId?: string) {
  const task = await prisma.task.create({ data });
  await prisma.taskHistory.create({ data: { taskId: task.id, updatedBy: task.createdBy, newValue: task as unknown as Prisma.InputJsonValue } });
  await prisma.auditLog.create({ data: { userId, action: "CREATE", resource: "task", metadata: { taskId: task.id } } });
  return task;
}

export async function updateTask(id: string, data: Prisma.TaskUncheckedUpdateInput, updatedBy: string) {
  const oldTask = await prisma.task.findUnique({ where: { id } });
  if (!oldTask) throw new AppError("Task not found", 404);

  const task = await prisma.task.update({ where: { id }, data });
  await prisma.taskHistory.create({
    data: {
      taskId: id,
      updatedBy,
      oldValue: oldTask as unknown as Prisma.InputJsonValue,
      newValue: task as unknown as Prisma.InputJsonValue,
    },
  });
  return task;
}

export async function getTaskHistory(taskId: string) {
  return prisma.taskHistory.findMany({ where: { taskId }, include: { updater: true }, orderBy: { createdAt: "desc" } });
}
