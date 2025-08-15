import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getSocials = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("socials").collect();
    return all[0] ?? null;
  },
});

export const setSocials = mutation({
  args: {
    facebook: v.string(),
    instagram: v.string(),
  },
  handler: async (ctx, args) => {
    const normalized = {
      facebook: args.facebook.trim(),
      instagram: args.instagram.trim(),
    } as const;
    const existing = await ctx.db.query("socials").collect();
    if (existing.length > 0) {
      await ctx.db.patch(existing[0]._id, normalized);
      return existing[0]._id;
    }
    return await ctx.db.insert("socials", normalized);
  },
});
