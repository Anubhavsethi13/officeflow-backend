import bcrypt from "bcryptjs";
import { prisma } from "../config/database";
import { AppError } from "../utils/app-error";
import { signAccessToken, signRefreshToken } from "../utils/jwt";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true, employee: true },
  });

  if (!user || user.status !== "ACTIVE" || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid credentials", 401);
  }

  const payload = { sub: user.id, role: user.role.name, employeeId: user.employeeId || undefined };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });
  await prisma.auditLog.create({ data: { userId: user.id, action: "LOGIN", resource: "auth" } });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role.name,
      employee: user.employee,
    },
  };
}

export async function logout(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
  await prisma.auditLog.create({ data: { userId, action: "LOGOUT", resource: "auth" } });
}
