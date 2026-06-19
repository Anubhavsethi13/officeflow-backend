import { UserStatus } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      id: string;
      role: string;
      employeeId?: string | null;
      status: UserStatus;
    }

    interface Request {
      user?: User;
    }
  }
}
