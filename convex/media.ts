import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const save = internalMutation({
  args: {
    storageId: v.id("_storage"),
    contentType: v.string(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    size: v.optional(v.number()),
    alt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("media", {
      storageId: args.storageId,
      contentType: args.contentType,
      width: args.width,
      height: args.height,
      size: args.size,
      alt: args.alt,
      createdAt: now,
    });
  },
});

// URLs should be generated client-side via storage.getUrl using actions as needed.
