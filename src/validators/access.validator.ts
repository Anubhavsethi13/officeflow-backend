import { z } from "zod";

export const permissionSchema = z.object({
  roleId: z.string().uuid(),
  moduleId: z.string().uuid(),
  canView: z.boolean().default(false),
  canCreate: z.boolean().default(false),
  canUpdate: z.boolean().default(false),
  canDelete: z.boolean().default(false),
});

export const permissionUpdateSchema = permissionSchema.omit({ roleId: true, moduleId: true }).partial();
