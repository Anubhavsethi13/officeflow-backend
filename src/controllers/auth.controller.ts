import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { loginSchema, refreshSchema } from "../validators/auth.validator";
import { ok } from "../utils/response";

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);
  return ok(res, await authService.login(data.email, data.password));
}

export async function logout(req: Request, res: Response) {
  await authService.logout(req.user!.id);
  return ok(res, { message: "Logged out" });
}

export async function me(req: Request, res: Response) {
  return ok(res, req.user);
}

export async function refresh(req: Request, res: Response) {
  const data = refreshSchema.parse(req.body);
  return ok(res, await authService.refresh(data.refreshToken));
}
