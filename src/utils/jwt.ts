import jwt, { SignOptions } from "jsonwebtoken";

if (process.env.NODE_ENV === "production") {
  if (!process.env.JWT_ACCESS_SECRET || process.env.JWT_ACCESS_SECRET === "change-me-access") {
    throw new Error("JWT_ACCESS_SECRET must be set to a secure value in production");
  }
  if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET === "change-me-refresh") {
    throw new Error("JWT_REFRESH_SECRET must be set to a secure value in production");
  }
}

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

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || "refresh-secret") as {
    sub: string;
    role: string;
    employeeId?: string;
  };
}
