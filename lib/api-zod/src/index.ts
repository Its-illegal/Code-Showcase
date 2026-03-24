export * from "./generated/api";
export * from "./generated/types";

import { GetCurrentAuthUserResponse } from "./generated/api";
import { z } from "zod";

// AuthUser is the non-null shape of the user returned by GET /api/auth/user.
// This type is consumed by authMiddleware (req.user) and auth routes.
export type AuthUser = NonNullable<z.infer<typeof GetCurrentAuthUserResponse>["user"]>;
