import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { publishedOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    if (args.publishedOnly) {
      return await ctx.db
        .query("pages")
        .withIndex("by_published", (q) => q.eq("published", true))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("pages").order("desc").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    content: v.any(),
    excerpt: v.optional(v.string()),
    heroImageId: v.optional(v.id("_storage")),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        title: args.title,
        content: args.content,
        excerpt: args.excerpt,
        heroImageId: args.heroImageId,
        published: args.published,
        updatedAt: now,
      });
      return existing._id;
    }
    return await ctx.db.insert("pages", {
      slug: args.slug,
      title: args.title,
      content: args.content,
      excerpt: args.excerpt,
      heroImageId: args.heroImageId,
      published: args.published,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const remove = mutation({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const existing = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      return true;
    }
    return false;
  },
});
