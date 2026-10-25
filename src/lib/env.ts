// src/config/env.ts
import { z } from "zod";

const envSchema = z.object({
  // Vite requires client-side variables to be prefixed with VITE_
  VITE_MAPTILER_KEY: z.string().nonempty(),
});

// Run validation safely
const _env = envSchema.safeParse(import.meta.env);

if (!_env.success) {
  console.error(
    "❌ Invalid environment variables:",
    z.treeifyError(_env.error),
  );
  throw new Error("Invalid environment variables");
}

// Export the typed, immutable environment object
export const env = _env.data;
