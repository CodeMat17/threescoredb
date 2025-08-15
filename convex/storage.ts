import { v } from "convex/values";
import { action } from "./_generated/server";

export const getUrl = action({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});
