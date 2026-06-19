import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/database";
import { AppError } from "../utils/app-error";
import { verifyAccessToken } from "../utils/jwt";

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, include: { role: true } });

    if (!user || user.status !== "ACTIVE") {
      return next(new AppError("Unauthorized", 401));
    }

    req.user = { id: user.id, role: user.role.name, employeeId: user.employeeId, status: user.status };
    return next();
  } catch {
    return next(new AppError("Unauthorized", 401));
  }
}
