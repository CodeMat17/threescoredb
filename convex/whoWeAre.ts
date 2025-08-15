import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getWhoWeAre = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("whoWeAre").collect();
    return all[0] ?? null;
  },
});

export const setWhoWeAre = mutation({
  args: {
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("whoWeAre").collect();
    if (existing.length > 0) {
      await ctx.db.patch(existing[0]._id, {
        title: args.title.trim(),
        body: args.body.trim(),
      });
      return existing[0]._id;
    }
    return await ctx.db.insert("whoWeAre", {
      title: args.title.trim(),
      body: args.body.trim(),
    });
  },
});
