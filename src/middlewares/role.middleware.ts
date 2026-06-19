import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/database";
import { AppError } from "../utils/app-error";

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Access denied", 403));
    }
    return next();
  };
}

export function requirePermission(moduleName: string, action: "canView" | "canCreate" | "canUpdate" | "canDelete") {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    if (req.user.role === "SUPER_ADMIN") {
      return next();
    }

    const permission = await prisma.permission.findFirst({
      where: { role: { name: req.user.role }, module: { moduleName }, [action]: true },
    });

    if (!permission) {
      return next(new AppError("Access denied", 403));
    }

    return next();
  };
}
