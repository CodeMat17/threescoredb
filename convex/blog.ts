import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
// Import dynamically to avoid server type friction; keep types via dev dep
import sanitizeHtml from "sanitize-html";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Queries
export const getBlog = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("blog").collect();
  },
});

export const getBlogBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const post = await ctx.db
      .query("blog")
      .filter((q) => q.eq(q.field("slug"), slug))
      .first();
    return post ?? null;
  },
});

// Mutations
export const addBlog = mutation({
  args: {
    title: v.string(),
    // description: v.string(),
    content: v.string(),
    imageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const title = args.title.trim();
    // const description = args.description.trim();
    const content = sanitizeHtml(args.content.trim());
    if (!title) throw new Error("Title is required");
    // if (!description) throw new Error("Description is required");
    if (!content) throw new Error("Content is required");
    const slugBase = slugify(title);
    // Ensure unique slug
    const all = await ctx.db.query("blog").collect();
    let slug = slugBase;
    let suffix = 1;
    while (all.some((b) => b.slug === slug)) {
      suffix += 1;
      slug = `${slugBase}-${suffix}`;
    }
    const image = await ctx.storage.getUrl(args.imageId);
    if (!image) throw new Error("Failed to resolve image URL");
    return await ctx.db.insert("blog", {
      slug,
      title,
      // description,
      content,
      imageId: args.imageId,
      image,
    });
  },
});

export const updateBlog = mutation({
  args: {
    id: v.id("blog"),
    title: v.string(),
    // description: v.string(),
    content: v.string(),
    imageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const title = args.title.trim();
    // const description = args.description.trim();
    const content = sanitizeHtml(args.content.trim());
    if (!title) throw new Error("Title is required");
    // if (!description) throw new Error("Description is required");
    if (!content) throw new Error("Content is required");
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Blog not found");
    // Update slug if title changed
    let slug = existing.slug as string;
    if (existing.title !== title) {
      const slugBase = slugify(title);
      const all = await ctx.db.query("blog").collect();
      slug = slugBase;
      let suffix = 1;
      while (all.some((b) => b.slug === slug && b._id !== args.id)) {
        suffix += 1;
        slug = `${slugBase}-${suffix}`;
      }
    }
    const image = await ctx.storage.getUrl(args.imageId);
    if (!image) throw new Error("Failed to resolve image URL");
    await ctx.db.patch(args.id, {
      slug,
      title,
      // description,
      content,
      imageId: args.imageId,
      image,
    });
    return args.id;
  },
});

export const deleteBlog = mutation({
  args: { id: v.id("blog") },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db.get(id);
    if (doc?.imageId) {
      await ctx.storage.delete(doc.imageId as Id<"_storage">);
    }
    await ctx.db.delete(id);
    return true;
  },
});
