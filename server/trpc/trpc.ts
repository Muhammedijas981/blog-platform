import { initTRPC } from "@trpc/server";
import { db } from "../db";
import superjson from "superjson";

// Create context for tRPC
export const createTRPCContext = async () => {
  return {
    db,
  };
};

// Initialize tRPC
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

// Export reusable router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
