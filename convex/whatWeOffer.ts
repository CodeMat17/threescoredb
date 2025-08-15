import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getWhatWeOffer = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("whatWeOffer").collect();
    return all[0] ?? null;
  },
});

export const setWhatWeOffer = mutation({
  args: {
    title: v.string(),
    items: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("whatWeOffer").collect();
    if (existing.length > 0) {
      await ctx.db.patch(existing[0]._id, {
        title: args.title.trim(),
        items: args.items.map((i) => i.trim()).filter(Boolean),
      });
      return existing[0]._id;
    }
    return await ctx.db.insert("whatWeOffer", {
      title: args.title.trim(),
      items: args.items.map((i) => i.trim()).filter(Boolean),
    });
  },
});
