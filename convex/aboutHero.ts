import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAboutHero = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("aboutHero").collect();
    return all[0] ?? null;
  },
});

export const setAboutHero = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    imageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const image = await ctx.storage.getUrl(args.imageId);
    if (!image) throw new Error("Failed to resolve image URL");

    const existing = await ctx.db.query("aboutHero").collect();
    if (existing.length > 0) {
      await ctx.db.patch(existing[0]._id, {
        title: args.title.trim(),
        description: args.description.trim(),
        imageId: args.imageId,
        image,
      });
      return existing[0]._id;
    }

    return await ctx.db.insert("aboutHero", {
      title: args.title.trim(),
      description: args.description.trim(),
      imageId: args.imageId,
      image,
    });
  },
});
