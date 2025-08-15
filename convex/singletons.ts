import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    return await ctx.db
      .query("singletons")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
  },
});

export const set = mutation({
  args: { key: v.string(), data: v.any() },
  handler: async (ctx, { key, data }) => {
    const existing = await ctx.db
      .query("singletons")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { data, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert("singletons", { key, data, updatedAt: now });
  },
});
