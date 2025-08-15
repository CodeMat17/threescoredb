import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getWhyChooseUs = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("whyChooseUs").collect();
    return all[0] ?? null;
  },
});

export const setWhyChooseUs = mutation({
  args: {
    items: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("whyChooseUs").collect();
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
    return await ctx.db.insert("whyChooseUs", {
      items: normalizedItems,
    });
  },
});
