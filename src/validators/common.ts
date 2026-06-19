import { z } from "zod";

export const uuidParam = z.object({ id: z.string().uuid() });
