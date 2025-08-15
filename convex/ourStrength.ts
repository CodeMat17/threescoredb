import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOurStrength = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("ourStrength").collect();
    return all[0] ?? null;
  },
});

export const setOurStrength = mutation({
  args: {
    items: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("ourStrength").collect();
    const normalizedItems = args.items.map((i) => ({
      title: i.title.trim(),
      description: i.description.trim(),
    }));
    if (existing.length > 0) {
      await ctx.db.patch(existing[0]._id, {
        items: normalizedItems,
      });
      return existing[0]._id;
    }
    return await ctx.db.insert("ourStrength", {
      items: normalizedItems,
    });
  },
});
