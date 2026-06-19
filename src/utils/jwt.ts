import jwt, { SignOptions } from "jsonwebtoken";

export function signAccessToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET || "access-secret", {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  } as SignOptions);
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || "refresh-secret", {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  } as SignOptions);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET || "access-secret") as {
    sub: string;
    role: string;
    employeeId?: string;
  };
}
